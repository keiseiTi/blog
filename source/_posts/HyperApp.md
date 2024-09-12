---
title: HyperApp源码解析
date: 2019-02-14 14:28:51
tags: 
---

version: 1.2.9

两个函数：`h` 和 `app`。

`h` 是用来转化编译后的 `jsx` 的具体函数。

`app` 是用来连接 `state` , `actions` 和 `view` ，生成dom节点，挂载到 `container` ，最终得到具体视图。

    在逐渐深入了解下，深感此框架特别灵活


## 函数 `h`

```javascript
/**
 * 
 * @param {String} name 元素名
 * @param {Object} attributes 元素属性
 * @param {Array|String} children 子元素
 */
function h(name, attributes) {
  var rest = []
  var children = []
  var length = arguments.length
  // 除了 name and attributes ， 其余参数 push rest
  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    var node = rest.pop()
    // 判断该元素是否为数组
    if (node && node.pop) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }
  // 如果该元素类型是函数，则该元素是一个自定义JSX函数
  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}
```

<!-- more -->

## 函数 `app`

有四个参数，分别是 `state` , `actions` , `view` , `container`。

`state` : 表示应用的所有数据

`actions` : 改变state的唯一方式是通过此动作

`view` : 应用程序的视图，可以连接 `state` 和 `actions`

`container` : 一个dom元素，需要在其上挂载应用

#### 函数内部

首先定义了7个变量，分明是：

`map <Function>` : 提取 `Array.map`

`rootElement <Object>` : 根元素

`oldNode <Object>` : 旧的节点

`lifecycle <Array>` : 生命周期

`skipRender <undefined>` : 跳过渲染

`isRecycling <Boolean>` : 是否循环

`globalState <Object>` : 全局状态

`wiredActions <Object>` : 有线动作

接着执行函数 `scheduleRender`

```javascript
//  调度render
function scheduleRender() {
  // skipRender初始为undefined，所以if语句为true，继续执行
  if (!skipRender) {
    skipRender = true
    setTimeout(render)
  }
}
```

**因为使用了 `setTimeout` ,所以在定时器到期后执行 `render`。(具体浏览器Event Loop)**

最后返回 `wiredActions`。

`wiredActions` 的获取是通过函数 `wireStateToActions`。

```javascript
/**
 * 
 * @param {Array} path 
 * @param {Object} state 
 * @param {Object} actions 
 */
function wireStateToActions(path, state, actions) {
  // 遍历actions
  for (var key in actions) {
    // 判断actions[key]的类型
    // 不是function，即actions嵌套在命名空间中
    typeof actions[key] === "function"
      ? (function(key, action) {
          // 使用IIFE，重新定义actions[key]，连接state和actions[key]
          actions[key] = function(data) {
            // 操作时执行
            // 返回操作后的结果
            ...
            ...
            ...
          }
        })(key, actions[key])
      : wireStateToActions(
          path.concat(key),
          (state[key] = clone(state[key])),
          (actions[key] = clone(actions[key]))
        )
  }
  return actions
}
```

##### 辅助函数 `clone`

```javascript
// 浅拷贝
function clone(target, source) {
  var out = {}
  for (var i in target) out[i] = target[i]
  for (var i in source) out[i] = source[i]
  return out
}
```

##### 函数 `recycleElement`

```javascript
// 主要用于判断节点类型是否为TEXT
function recycleElement(element) {
  return {
    nodeName: element.nodeName.toLowerCase(),
    attributes: {},
    children: map.call(element.childNodes, function(element) {
      return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue
        : recycleElement(element)
    })
  }
}
```


*具体为什么要使用setTimeout，返回wiredActions的意义是什么*

定时器到期执行函数 `render`

```javascript
function render() {
  // old: skipRender = true , new: skipRender = false
  skipRender = !skipRender
  // 生成节点
  var node = resolveNode(view) // resolveNode见下文
  // container是必须的，!skipRender = true
  if (container && !skipRender) {
    // 生成虚拟dom
    rootElement = patch(container, rootElement, oldNode, (oldNode = node))
  }

  isRecycling = false
  // 判断是否存在生命周期，如果有，则一个接一个执行
  while (lifecycle.length) lifecycle.pop()()
}
```

##### 函数 `resolve`

```javascript
// 判断node是否是个函数，是函数即转化，不是则返回此node (view = (state,actions) => 视图)
function resolveNode(node) {
  return typeof node === "function"
    ? resolveNode(node(globalState, wiredActions))
    : node != null
      ? node
      : ""
}
```

##### 函数 `patch`

```javascript
function patch(parent, element, oldNode, node, isSvg) {
  if (node === oldNode) {
    // 新旧节点一样
  } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
    // 老节点 == null 或者 新旧节点nodeName不一样，初始时执行
    var newElement = createElement(node, isSvg) // createElement见下文
    // 将虚拟dom插入到跟节点中，渲染视图
    parent.insertBefore(newElement, element)

    if (oldNode != null) {
      removeElement(parent, element, oldNode) // removeElement见下文
    }

    element = newElement
  } else if (oldNode.nodeName == null) {
    element.nodeValue = node
  } else {
    ...
  }
  return element
}

```

##### 创建元素函数 `createElement`

```javascript
// 根据babel转化jsx之后的node，创建虚拟dom节点
function createElement(node, isSvg) {
  var element =
    typeof node === "string" || typeof node === "number"
      ? document.createTextNode(node)
      : (isSvg = isSvg || node.nodeName === "svg")
        ? document.createElementNS(
            "http://www.w3.org/2000/svg",
            node.nodeName
          )
        : document.createElement(node.nodeName)

  var attributes = node.attributes
  // 该节点属性
  if (attributes) {
    // oncreate
    if (attributes.oncreate) {
      lifecycle.push(function() {
        attributes.oncreate(element)
      })
    }
    // 该node下有children
    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(
        createElement(
          (node.children[i] = resolveNode(node.children[i])),
          isSvg
        )
      )
    }

    for (var name in attributes) {
      // 更新节点属性
      updateAttribute(element, name, attributes[name], null, isSvg) // updateAttribute见下文
    }
  }

  return element
}
```

##### 更新属性函数 `updateAttribute`

```javascript
function updateAttribute(element, name, value, oldValue, isSvg) {
  if (name === "key") {
  } else if (name === "style") {
    /**
     * 样式有两种形式，string 和 object
     * 是string, 赋值给element.style.cssText
     * 是object, 将oldValue和element.style.cssText为空，然后设置样式
     */
    if (typeof value === "string") {
      element.style.cssText = value
    } else {
      if (typeof oldValue === "string") oldValue = element.style.cssText = ""
      for (var i in clone(oldValue, value)) {
        var style = value == null || value[i] == null ? "" : value[i]
        if (i[0] === "-") {
          element.style.setProperty(i, style)
        } else {
          element.style[i] = style
        }
      }
    }
  } else {
    // 方法，已on开头
    if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2)
      // 该元素存在events
      if (element.events) {
        // oldValue不存在
        if (!oldValue) oldValue = element.events[name]
      } else {
        // 初始化元素事件
        element.events = {}
      }
      // 给元素添加新事件
      element.events[name] = value

      if (value) {
        if (!oldValue) {
          element.addEventListener(name, eventListener) // eventLister见下文
        }
      } else {
        element.removeEventListener(name, eventListener)
      }
    } else if (
      // 其他属性
      name in element &&
      name !== "list" &&
      name !== "type" &&
      name !== "draggable" &&
      name !== "spellcheck" &&
      name !== "translate" &&
      !isSvg
    ) {
      element[name] = value == null ? "" : value
    } else if (value != null && value !== false) {
      element.setAttribute(name, value)
    }

    if (value == null || value === false) {
      element.removeAttribute(name)
    }
  }
}
```

##### 函数 `eventListener`

```javascript
/**
 * event.currentTarget 当前注册事件的对象的引用
 * event.currentTarget.events 已在函数 `updateAttribute` 定义
 * event.type 事件类型
 * 最后传入 event，得到预期效果
 */ 
function eventListener(event) {
  return event.currentTarget.events[event.type](event)
}
```

##### 函数 `removeElement`

```javascript
function removeElement(parent, element, node) {
  function done() {
    parent.removeChild(removeChildren(element, node)) // 见下文
  }
  // 判断属性是否有onremove
  var cb = node.attributes && node.attributes.onremove
  if (cb) {
    cb(element, done)
  } else {
    done()
  }
}
```

##### 函数 `removeChildren`

```javascript
function removeChildren(element, node) {
  var attributes = node.attributes
  if (attributes) {
    for (var i = 0; i < node.children.length; i++) {
      // 递归
      removeChildren(element.childNodes[i], node.children[i])
    }
    // 判断属性是否有ondestory
    if (attributes.ondestroy) {
      attributes.ondestroy(element)
    }
  }
  return element
}
```

此上为初始化，创建虚拟dom，挂载节点，生成元素。

当执行一个操作，发起一个action时

```javascript
function wireStateToActions(path, state, actions) {
  ...
  typeof actions[key] === "function"
    // 使用IIFE，将actions[key]重新封装
    ? (function(key, action) {
        actions[key] = function(data) {
          // action(data)，执行第一层函数，返回第二层函数
          var result = action(data)
          if (typeof result === "function") {
            // 执行完返回后结果
            result = result(getPartialState(path, globalState), actions) // getPartialState见下文
          }
          if (
            result &&
            result !== (state = getPartialState(path, globalState)) &&
            !result.then // !isPromise
          ) {
            // 再一次调度render
            scheduleRender(
              (globalState = setPartialState(
                path,
                clone(state, result),
                globalState
              )) // setPartialState见下文
            )
          }
          return result
        }
      })(key, actions[key])
    : ...
  }
}
```

##### 函数 `getPartialState`

```javascript
// 命名空间
function getPartialState(path, source) {
  var i = 0
  while (i < path.length) {
    source = source[path[i++]]
  }
  return source
}
```

##### 函数 `setPartialState`

```javascript
function setPartialState(path, value, source) {
  var target = {}
  if (path.length) {
    target[path[0]] =
      path.length > 1
        ? setPartialState(path.slice(1), value, source[path[0]])
        : value
    return clone(source, target)
  }
  return value
}
```

然后执行 `scheduleRender` ，更新虚拟dom，生成最新视图。
这时，`rootElement` 是一个虚拟dom。

##### 函数 `patch`

```javascript
function patch(parent, element, oldNode, node, isSvg) {
  if (node === oldNode) {
  } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
    ...
    ...
  } else {
    updateElement(
      element,
      oldNode.attributes,
      node.attributes,
      (isSvg = isSvg || node.nodeName === "svg")
    ) // updateElement见下文

    var oldKeyed = {}
    var newKeyed = {}
    var oldElements = []
    var oldChildren = oldNode.children
    var children = node.children

    for (var i = 0; i < oldChildren.length; i++) {
      oldElements[i] = element.childNodes[i]

      var oldKey = getKey(oldChildren[i]) // getKey见下文
      // 存在key，
      if (oldKey != null) {
        oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
      }
    }

    var i = 0
    var k = 0
    // 判断子节点是否需要更新，根据key值
    while (k < children.length) {
      var oldKey = getKey(oldChildren[i])
      var newKey = getKey((children[k] = resolveNode(children[k])))

      if (newKeyed[oldKey]) {
        i++
        continue
      }

      if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
        if (oldKey == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
        continue
      }

      if (newKey == null || isRecycling) {
        if (oldKey == null) {
          patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
          k++
        }
        i++
      } else {
        var keyedNode = oldKeyed[newKey] || []

        if (oldKey === newKey) {
          patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
          i++
        } else if (keyedNode[0]) {
          patch(
            element,
            element.insertBefore(keyedNode[0], oldElements[i]),
            keyedNode[1],
            children[k],
            isSvg
          )
        } else {
          patch(element, oldElements[i], null, children[k], isSvg)
        }

        newKeyed[newKey] = children[k]
        k++
      }
    }

    while (i < oldChildren.length) {
      if (getKey(oldChildren[i]) == null) {
        removeElement(element, oldElements[i], oldChildren[i])
      }
      i++
    }

    for (var i in oldKeyed) {
      if (!newKeyed[i]) {
        removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
      }
    }
  }
  return element
}
```

##### 更新元素函数 `updateElement`

```javascript
function updateElement(element, oldAttributes, attributes, isSvg) {
  // clone(oldAttributes, attributes) 最新节点属性
  for (var name in clone(oldAttributes, attributes)) {
    if (
      attributes[name] !==
      (name === "value" || name === "checked"
        ? element[name]
        : oldAttributes[name])
    ) {
      updateAttribute(
        element,
        name,
        attributes[name],
        oldAttributes[name],
        isSvg
      ) // updateAttribute见上文
    }
  }
  // 初始时 isRecycling为true，更新时为false
  var cb = isRecycling ? attributes.oncreate : attributes.onupdate
  if (cb) {
    lifecycle.push(function() {
      cb(element, oldAttributes)
    })
  }
}
```

##### 得到 `key` 函数 `getKey`

```javascript
function getKey(node) {
  return node ? node.key : null
}
```


