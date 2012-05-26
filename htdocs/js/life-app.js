
function LifeApp()
{
  var self = {

    init : function( $elem )
    {
      var self = this;
      self.$elem = $elem;
      self.life = Life.life( 30, 30 );
      self.playing = 0;
      self.generation = 0;
      return self;
    },

    install : function()
    {
      var self = this;
      var $grid = $( '.grid', self.$elem );
      var $controls = $( '.controls', self.$elem );
      var $play = $( 'input[name="play"]', $controls );
      var $reset = $( 'input[name="reset"]', $controls );

      $grid.bind( 'click', { self : self }, self.click );
      $play.bind( 'click', function() { self.playing ^= 1; self.draw() } );
      $reset.bind( 'click', function() { self.life.clear(); self.generation = 0; self.draw() } );

      self.timer = setInterval( function() { self.tick() }, 200 );

      return self;
    },

    uninstall : function()
    {
      var self = this;
      // TODO undo the above event handling stuff
      return self;
    },

    tick : function()
    {
      var self = this;
      if (!self.playing)
        return;
      self.generation += 1;
      self.life.next();
      self.draw();
    },

    click : function(ev)
    {
      var self = ev.data.self;
      var $grid = $( '.grid', self.$elem );
      var pos = $grid.offset();
      var x = Math.floor( (ev.pageX - pos.left) / 24 );
      var y = Math.floor( (ev.pageY - pos.top) / 24 );
      console.log(x,y);
      self.life.toggle(x,y);
      self.draw();
    },

    draw : function()
    {
      var self = this;
      var $grid = $( '.grid', self.$elem );
      var $controls = $( '.controls', self.$elem );
      var $play = $( 'input[name="play"]', $controls );
      var $generation = $( '.generation em', $controls );

      var grid = self.life.grid;
      var cx = self.life.cx;
      var cy = self.life.cy;
      var html = '<ul>';
      for (y=0; y<cy; y++) {
        html += '<li><ol>';
        for (x=0; x<cx; x++)
          html += '<li class="'+(grid[x][y] ? 'live' : 'dead')+'"></li>';
        html += '</ol></li>';
      }
      html += '</ul>';
      $grid.html( html );

      $play.val( self.playing ? 'pause' : 'play' );
      $generation.html( self.generation );
    },

    nothing : null

  };
  
  return self.init.apply( self, arguments );
}

