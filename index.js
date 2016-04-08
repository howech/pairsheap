// This is the internal data structure for holding data,
// prirorities and the heap structure. Nodes hold a link to their
// parent, to the first node of a singly linked list of children.
function heapNode(priority, data) {
    this.priority = priority
    this.data = data
    this.parent = null
    this.child = null
    this.sib = null
}

// Merge two heap nodes into a single heap. The one with
// the lower priority becomes the parent, and the other one
// gets pushed to the top of the child list for the new parent.
//
// Note that each of the nodes being merged should not have siblings.
var mergeHeapNodes = function(h1, h2) {
    if(h1 == null) {
        return h2
    }

    if(h2 == null) {
        return h1
    }

    if(h1.priority > h2.priority) {
        var t = h1
        h1 = h2
        h2 = t
    }

    h1.addChild(h2)
    return h1
}

// This method merges children two and three, and
// then merges the resulting node into child one. This
// contracts the number of children by as many as two.
heapNode.prototype.mergeTwoThree = function() {
    var a = this.child
    if(a) {
        var b = a.sib
        var c = b && b.sib
        var d = c && c.sib

        a.sib = null
        if(b) {
            b.sib = null
        }
        if(c) {
            c.sib = null
        }

        a = mergeHeapNodes(a,mergeHeapNodes(b,c))
        a.sib = d
        this.child = a
    }
}

// This method removes a node from the overall tree structure
// It does this by telling the nodes parent to contract its
// children until this node become the first child of a parent
// (in the process, this nodes parent can change). From there,
// the removal becomes simple.
heapNode.prototype.detach = function() {
    if(!this.parent) {
        return
    }

    while(this.parent.child != this) {
        this.parent.mergeTwoThree()
    }

    this.parent.child = this.sib
    this.parent = null
}

// Adds the child node as the first child in the list
heapNode.prototype.addChild = function(c) {
    c.sib = this.child
    this.child = c
    c.parent = this
}

// Merges children until there is only one.
heapNode.prototype.mergeChildren = function() {
    while(this.child && this.child.sib) {
        this.mergeTwoThree()
    }
}


// This is the outer structure that has all of the top
// level methods. It holds a pointer to the root of the
// tree structure, as well as a dictionary to help you get
// find your way back into the tree given a key that
// identifies your data
function PairsHeap() {
    this.heap = null
    this.size = 0
    this.index = {}
}


// This function tries to  get the key associated with your
// hunk of data. If your data structure has a "getKey" method,
// it calls it, if your structure has a 'key' property, it
// uses it, if you data is a string, it is its own key. Other
// wise, your data has no key and you will not be able to update
// or detete it from the queue
function getKeyFromData(data) {
    if(data && (data.getKey)) {
        return data.getKey()
    }
    if(data && hasOwnProperty.call(data,'key')) {
        return data['key']
    }
    if(typeof data == "string") {
       return data
    }
    return null
}

//insert an item into the queue
PairsHeap.prototype.Insert = function(priority, data) {
    var key = getKeyFromData(data)
    var node = new heapNode(priority, data)
    if(key) {
        this.index[key] = node
    }
    this.heap = mergeHeapNodes(this.heap, node)
    this.size += 1
}


// peek at the minimum on the queue
PairsHeap.prototype.Peek = function() {
    if(this.heap) {
        return [this.heap.priority, this.heap.data]
    } else {
        return [null, null]
    }
}

// delete the minimum from the queue
PairsHeap.prototype.DeleteMin = function() {
    if(this.heap) {
        var t = this.heap

        t.mergeChildren()
        this.heap = t.child

        if(this.heap) {
            this.heap.parent = null
        }

        t.child = null

        var key = getKeyFromData(t.data)
        if(key) {
            delete this.index[key]
        }
        this.size -= 1
    }
}

// deletes the minimum item and returns it
PairsHeap.prototype.Pop = function() {
    var x = this.Peek()
    this.DeleteMin()
    return x
}

// change the priority of an item (either up or down)
PairsHeap.prototype.UpdatePriority = function(priority, data) {
    var key = getKeyFromData(data)
    if(key) {
        var node = this.index[key]
        if(node) {
            if(priority < node.priority) {
                node.detach()
                node.priority = priority
                if(node != this.heap) {
                    this.heap = mergeHeapNodes(this.heap, node)
                }
            } else if (priority > node.priority) {
                node.detach()
                node.mergeChildren()
                node.priority = priority
                var ch = node.child
                if(ch) {
                    ch.parent = null
                }
                node.child = null
                ch = mergeHeapNodes(ch,node)
               if(node != this.heap) {
                   this.heap = mergeHeapNodes(this.heap,ch)
               } else {
                   this.heap = ch
               }
            }
            return true
        }
    }
    return false
}

// Delete an item
PairsHeap.prototype.Delete = function(data) {
    var key = getKeyFromData(data)
    var node = this.index[key]
    if(node) {
        delete this.index[key]
        node.detach()
        node.mergeChildren()

        var ch = node.child

        if(this.heap == node) {
            this.heap = ch
        } else {
            this.heap = mergeHeapNodes(this.heap,ch)
        }

        node.parent = null
        node.child = null

        this.size -= 1
    }
    return false
}

// get an item by its key
PairsHeap.prototype.GetItem = function(data) {
    var key = getKeyFromData(data)
    if(key) {
        var node = this.index[key]
        if(node) {
            return [node.priority, node.data]
        }
    }
    return [null,null]
}

module.exports = PairsHeap
