
function LifeApp()
{
  var self = {

    defaults : {
      // Size of grid
      cx : 30,
      cy : 30,
      // Size of tile element in pixels
      tile_cx : 24,
      tile_cy : 24,
      // Refresh delay between generations
      delay : 200,
      // Wrap at edges of grid? (eg toroidal surface)
      wrap : 1,
      // Avoid trailing js comma ;)
      nothing : null
    },

    init : function( $elem, options )
    {
      var self = this;
      self.options = $.extend( {}, self.defaults, options );
      self.$elem = $elem;
      self.life = Life.life( self.options.cx, self.options.cy );
      self.playing = 0;
      self.generation = 0;
      self.setup();
      self.draw();
      return self;
    },

    install : function()
    {
      var self = this;
      var grid = self.life.grid;
      var $grid = $( '.grid', self.$elem );
      var $controls = $( '.controls', self.$elem );
      var $play = $( 'input[name="play"]', $controls );
      var $reset = $( 'input[name="reset"]', $controls );
      var $random = $( 'input[name="random"]', $controls );
      var $sizes = $( '.size input[type="text"]', $controls );
      var $wrap = $( 'input[name="wrap"]', $controls );

      $play.bind( 'click', function() {
        self.playing ^= 1;
        self.draw();
      } );

      $reset.bind( 'click', function() {
        self.playing = 0;
        self.life.clear();
        self.generation = 0;
        self.draw();
      } );

      $random.bind( 'click', function() {
        self.playing = 0;
        self.life.random();
        self.draw();
      } );

      var $cells = $( 'ul > li > ol > li', $grid );
      $cells.bind( 'click mouseenter', { self : self }, self.mouse );

      $sizes.bind( 'change', function() {
        // TODO 
      } );

      $wrap.bind( 'change', function() {
        self.options.wrap = $wrap.attr("checked") ? 1 : 0;
      } );

      self.timer = setInterval( function() { self.tick() }, self.options.delay );

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
      self.life.next( self.options.wrap );
      self.draw();
    },

    mouse : function(ev)
    {
      if (ev.type == 'mouseenter' && !ev.which)
        return;

      var self = ev.data.self;
      var $grid = $( '.grid', self.$elem );
      var pos = $grid.offset();
      var x = Math.floor( (ev.pageX - pos.left) / self.options.tile_cx );
      var y = Math.floor( (ev.pageY - pos.top) / self.options.tile_cy );

      self.life.toggle(x,y);
      self.draw();
    },

    setup : function()
    {
      var self = this;
      var $grid = $( '.grid', self.$elem );

      var grid = self.life.grid;
      var cx = self.options.cx;
      var cy = self.options.cy;
      var html = '<ul>';

      for (y=0; y<cy; y++) {
        html += '<li><ol>';
        for (x=0; x<cx; x++)
          html += '<li></li>';
        html += '</ol></li>';
      }

      html += '</ul>';
      $grid.html( html );

      return self;
    },

    draw : function()
    {
      var self = this;
      var $grid = $( '.grid', self.$elem );
      var $controls = $( '.controls', self.$elem );
      var $generation = $( '.generation em', $controls );
      var $play = $( 'input[name="play"]', $controls );
      var $cx = $( '.size input[name="cx"]', $controls );
      var $cy = $( '.size input[name="cy"]', $controls );
      var $wrap = $( 'input[name="wrap"]', $controls );

      var grid = self.life.grid;
      var cx = self.options.cx;
      var cy = self.options.cy;
      var $rows = $( '.grid > ul > li', self.elem );

      for (y=0; y<cy; y++)
      {
        var $cols = $( 'ol > li', $rows[y] );

        for (x=0; x<cx; x++)
        {
          if (grid[x][y])
            $( $cols[x] ).addClass('live');
          else
            $( $cols[x] ).removeClass('live');
        }
      }

      $generation.html( self.generation );
      $play.val( self.playing ? 'pause' : 'play' );
      $cx.val( cx );
      $cy.val( cy );
      $wrap.attr( 'checked', self.options.wrap );
    },

    nothing : null

  };
  
  return self.init.apply( self, arguments );
}

