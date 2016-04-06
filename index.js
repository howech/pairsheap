function heapNode(priority, data) {
    this.priority = priority
    this.data = data
    this.parent = null
    this.child = null
    this.lsib = null
    this.rsib = null
}

heapNode.prototype.detach = function() {
    if(this.parent) {
        if(this.parent.child == this) {
            this.parent.child = this.rsib
        }
        this.parent = null
    }
    if(this.lsib) {
        this.lsib.rsib = this.rsib
    }
    if(this.rsib) {
        this.rsib.lsib = this.lsib
    }
    this.lsib = null
    this.rsib = null
}

heapNode.prototype.addChild = function(c) {
    if(this.child) {
        this.child.lsib = c
    }
    c.rsib = this.child
    c.parent = this
    this.child = c
}

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

var mergePairs = function(h) {
    // Non-recursive version to avoid huge callstacks in
    // pessimal cases. This version ends up pairing things up in
    // the reverse order from the simple reverse case
    // but it should not matter a whole lot

    var x = null

    while(h) {
        var y = h.rsib
        h.rsib = null

        var z = y && y.rsib

        if( y ) {
            y.lsib = null
            y.rsib = null
        }

        if(z) {
            z.lsib = null
        }

        y = mergeHeapNodes(h,y)
        x = mergeHeapNodes(x,y)
        h = z
    }

    return x
}



function PairsHeap() {
    this.heap = null
    this.size = 0
    this.index = {}
}


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

PairsHeap.prototype.Insert = function(priority, data) {
    var key = getKeyFromData(data)
    var node = new heapNode(priority, data)
    if(key) {
        this.index[key] = node
    }
    this.heap = mergeHeapNodes(this.heap, node)
    this.size += 1
}


PairsHeap.prototype.Peek = function() {
    if(this.heap) {
        return [this.heap.priority, this.heap.data]
    } else {
        return [null, null]
    }
}

PairsHeap.prototype.DeleteMin = function() {
    if(this.heap) {
        var t = this.heap
        this.heap = mergePairs(t.child)
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

PairsHeap.prototype.Pop = function() {
    x = this.Peek()
    this.DeleteMin()
    return x
}

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
                if( node.child ) {
                    node.priority = priority

                    var ch = mergePairs(node.child)
                    var parent = node.parent
                    var lsib = node.lsib
                    var rsib = node.rsib

                    node.child = null
                    node.parent = null
                    node.lsib = null
                    node.rsib = null

                    ch = mergeHeapNodes(ch, node)

                    ch.parent = parent
                    ch.lsib = lsib
                    ch.rsib = rsib

                    if( parent && !ch.lsib) {
                        parent.child = ch
                    }

                    if(!parent) {
                        this.heap = ch
                    }

                    if(ch.lsib) {
                        ch.lsib.rsib = ch
                    }
                    if(ch.rsib) {
                        ch.rsib.lsib = ch
                    }
                } else {
                    node.priority = priority
                }
            }
            return true
        }
    }
    return false
}

PairsHeap.prototype.Delete = function(data) {
    var key = getKeyFromData(data)
    var node = this.index[key]
    if(node) {
        delete this.index[key]
        node.detach()

        var ch = mergePairs(node.child)
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
