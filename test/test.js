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

        heap.UpdatePriority(4,"d")
        heap.UpdatePriority(2,"b")
        heap.UpdatePriority(3,"c")
        heap.UpdatePriority(1,"a")

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

        var more = new data('a')

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

    });

    var nodesizes = [100,1000,10000]
    var tests  = function(nodes) {
        it(''+nodes+' in order inserts', function() {
          var heap1 = new pairsheap();

          for(var i = 0; i< nodes; ++i) {
              heap1.Insert(i,"a"+i)
          }
          for(var i = 0; i< nodes; ++i) {
              heap1.Pop()
          }
          heap1.size.should.equal(0);
      });


      it('' + nodes + ' reveerse order inserts', function() {
          var heap2 = new pairsheap()

          for(var i = 0; i< nodes; ++i) {
              heap2.Insert(nodes-i,"a"+i)
          }
          for(var i = 0; i< nodes; ++i) {
              heap2.Pop()
          }
          heap2.size.should.equal(0);

      });

      it('' + nodes + ' random order inserts', function() {
          var heap2 = new pairsheap()

          for(var i = 0; i< nodes; ++i) {
              heap2.Insert(Math.random(),"a"+i)
          }
          for(var i = 0; i< nodes; ++i) {
              heap2.Pop()
          }
          heap2.size.should.equal(0);

      });

    };

    for(var i=0;i<3; i++) {
        tests(nodesizes[i])
    }

});
