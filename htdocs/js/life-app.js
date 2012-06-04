
function LifeApp()
{
  var self = {

    defaults : {
      // Size of grid
      cx : 30, cy : 30,
      // Size of tile element in pixels
      tile_cx : 24, tile_cy : 24,
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
      self.life = Life.life( self.options.cx, self.options.cy );
      delete self.options.cx;
      delete self.options.cy;
      self.$elem = $elem;
      self.playing = 0;
      self.generation = 0;
      self.setup();
      self.draw();
      return self;
    },

    install : function()
    {
      return this
        .install_events()
        .install_timer();
    },

    install_events : function()
    {
      var self = this;
      var $grid = $( '.grid', self.$elem );
      var $controls = $( '.controls', self.$elem );
      var $play = $( 'input[name="play"]', $controls );
      var $reset = $( 'input[name="reset"]', $controls );
      var $random = $( 'input[name="random"]', $controls );
      var $sizes = $( '.size input[type="text"]', $controls );
      var $delay = $( 'input[name="delay"]', $controls );
      var $wrap = $( 'input[name="wrap"]', $controls );

      // Play button

      $play.bind( 'click.life', function() {
        self.playing ^= 1;
        self.draw();
      } );

      // Reset button 

      $reset.bind( 'click.life', function() {
        self.playing = 0;
        self.life.clear();
        self.generation = 0;
        self.draw();
      } );

      // Randomize button

      $random.bind( 'click.life', function() {
        self.playing = 0;
        self.life.random();
        self.draw();
      } );

      // Mouse events over the grid

      var $cells = $( 'ul > li > ol > li', $grid );
      $cells.bind( 'click.life mouseenter.life', { self : self }, self.mouse );

      // Resizing the grid

      $sizes.bind( 'change.life', function() {
        var cx = parseInt( $( $sizes[0] ).val() );
        var cy = parseInt( $( $sizes[1] ).val() );
        self.life.resize( cx, cy );
        self.uninstall();
        self.setup();
        self.draw();
        self.install();
      } );

      // Toggling wrapping in neighbor calculation.

      $wrap.bind( 'change.life', function() {
        self.options.wrap = $wrap.attr("checked") ? 1 : 0;
      } );

      // Change delay between ticks

      $delay.bind( 'change.life', function() {
        self.options.delay = parseInt( $delay.val() );
        self.uninstall_timer();
        self.install_timer();
      } );

      return self;
    },

    install_timer : function()
    {
      var self = this;
      // The tick handler.
      self.timer = setInterval( function() { self.tick() }, self.options.delay );
      return self;
    },

    uninstall : function()
    {
      return this
        .uninstall_events()
        .uninstall_timer();
    },

    uninstall_events : function()
    {
      $( '*', this.$elem ).unbind( '.life' );
      return this;
    },

    uninstall_timer : function()
    {
      if (this.timer) clearInterval( this.timer );
      this.timer = null;
      return this;
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
      var cx = grid.cx;
      var cy = grid.cy;
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
      var $delay = $( 'input[name="delay"]', $controls );
      var $wrap = $( 'input[name="wrap"]', $controls );

      var grid = self.life.grid;
      var cx = grid.cx;
      var cy = grid.cy;
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
      if (!$cx.is(':focus')) $cx.val( cx );
      if (!$cy.is(':focus')) $cy.val( cy );
      if (!$delay.is(':focus')) $delay.val( self.options.delay );
      if (!$wrap.is(':focus')) $wrap.attr( 'checked', self.options.wrap );
    },

    nothing : null

  };
  
  return self.init.apply( self, arguments );
}

