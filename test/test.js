var should = require('chai').should()
var pairsheap = require('../index.js')


describe('#pairsheap', function() {
  it('should have working insert, peek and pop methods on an empty heap', function() {
      var heap = new pairsheap();

      heap.Peek().should.deep.equal([null, null])
      heap.Pop().should.deep.equal([null, null])
      heap.size.should.equal(0)

      heap.Insert(1,"a")
      heap.size.should.equal(1)
      heap.heap.data.should.equal("a")
      heap.heap.priority.should.equal(1)

      heap.Peek().should.deep.equal([1,"a"])
      heap.size.should.equal(1)
      heap.Pop().should.deep.equal([1,"a"])
      heap.size.should.equal(0)
  });

  it('should always have the min value on top', function() {
      var heap = new pairsheap();

      heap.Insert(3,"c")
      heap.Insert(2,"b")
      heap.Peek().should.deep.equal([2,"b"])
      heap.Insert(1,"a")
      heap.Peek().should.deep.equal([1,"a"])
      heap.Insert(4,"d")
      heap.Peek().should.deep.equal([1,"a"])

      heap.Pop().should.deep.equal([1,"a"])
      heap.Pop().should.deep.equal([2,"b"])
      heap.Pop().should.deep.equal([3,"c"])
      heap.Pop().should.deep.equal([4,"d"])
  })


  it('should be possible to reorder the entire queue', function() {
      var heap = new pairsheap();

      heap.Insert(4,"a")
      heap.Insert(3,"b")
      heap.Insert(2,"c")
      heap.Insert(1,"d")

      heap.Peek().should.deep.equal([1,"d"])

      heap.UpdatePriority(1,"a")
      heap.UpdatePriority(2,"b")
      heap.UpdatePriority(3,"c")
      heap.UpdatePriority(4,"d")

      heap.Pop().should.deep.equal([1,"a"])
      heap.Pop().should.deep.equal([2,"b"])
      heap.Pop().should.deep.equal([3,"c"])
      heap.Pop().should.deep.equal([4,"d"])
      heap.size.should.equal(0)
  })


  it('allow you to delete from the queue', function() {
      var heap = new pairsheap();

      heap.Insert(1,"a")
      heap.Insert(2,"b")
      heap.Insert(3,"c")
      heap.Insert(4,"d")

      heap.Delete("c")
      heap.Delete("a")

      heap.Pop().should.deep.equal([2,"b"])
      heap.Pop().should.deep.equal([4,"d"])
      heap.size.should.equal(0)
  })

  it('allow complicated data objects with key field', function() {
      var heap = new pairsheap();

      heap.Insert(1, {key: 'a'})
      heap.UpdatePriority(2, 'a')

      heap.Pop().should.deep.equal([2,{key: 'a'}])
      heap.size.should.equal(0)
  })


  it('allow complicated data objects with getKey method', function() {
      var heap = new pairsheap();

      function data(key) {this.k = key}
      data.prototype.getKey = function() {return this.k}

      heap.Insert(1, new data('a'))
      heap.UpdatePriority(2, 'a')

      more = new data('a')

      heap.Pop().should.deep.equal([2,more])
      heap.size.should.equal(0)
  })

  it('should allow you to insert objects with no key', function() {
      var heap = new pairsheap();
      heap.Insert(1, {z: 'a'})
      heap.Insert(2, {z: 'b'})
      heap.Insert(3, {z: 'c'})
      heap.Insert(4, [1,2,3,4])

      heap.index.should.deep.equal({})

      heap.Pop().should.deep.equal([1,{z:'a'}])
      heap.Pop().should.deep.equal([2,{z:'b'}])
      heap.Pop().should.deep.equal([3,{z:'c'}])
      heap.Pop().should.deep.equal([4,[1,2,3,4]])
  })


  it('should allow you to retrive priority, data by key', function() {
      var heap = new pairsheap();

      function data(key) {this.k = key}
      data.prototype.getKey = function() {return this.k}

      heap.Insert(1, 'a')
      heap.Insert(2, {key: 'b'})
      heap.Insert(3, new data('c'))
      heap.Insert(4, 'd')

      heap.GetItem('a').should.deep.equal([1,'a'])
      heap.GetItem('b').should.deep.equal([2,{key: 'b'}])
      heap.GetItem('c').should.deep.equal([3,new data('c')])
      heap.GetItem('d').should.deep.equal([4,'d'])
      heap.GetItem('e').should.deep.equal([null,null])

  })

  it('timing should be reasonable', function() {
      var heap1 = new pairsheap();
      var heap2 = new pairsheap()

      var tstart = process.hrtime()
      var nodes = 100000
      for(var i = 0; i< nodes; ++i) {
          heap1.Insert(i,"a"+i)
      }
      for(var i = 0; i< nodes; ++i) {
          heap1.Pop()
      }
      var tmid = process.hrtime()
      for(var i = 0; i< nodes; ++i) {
          heap2.Insert(nodes-i,"a"+i)
      }
      for(var i = 0; i< nodes; ++i) {
          heap2.Pop()
      }
      var tend = process.hrtime()

      tend[0] -= tstart[0]
      tmid[0] -= tstart[0]
      tstart[0] -= tstart[0]

      var del1 = (tmid[0]- tstart[0]) * 1000000000 + tmid[1] - tstart[1]
      var del2 = (tend[0]- tmid[0]) * 1000000000 + tend[1] - tmid[1]
      var diff = del2 - del1
      if(diff < 0) {
          diff = -diff
      }
      diff.should.be.at.most(100000000);
  });

});
