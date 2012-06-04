var Life = 
{
  // ----- Class -----

  life : function()
  {
    var self = {    

      init : function() {
        var self = this;

        // One argument: scan from string representation
        // Two arguments: specify size for empty grid

        if (arguments.length == 1)
          self.scan( arguments[0] );
        else if (arguments.length == 2)
          self.grid = Life.empty( arguments[0], arguments[1] );

        return self;
      },

      clear : function() {
        this.grid = Life.empty( this.grid.cx, this.grid.cy );
        return this;
      },

      random : function() {
        this.grid = Life.random( this.grid.cx, this.grid.cy );
        return this;
      },

      resize : function( cx, cy ) {
        var newgrid = Life.empty( cx, cy );
        this.grid = Life.copy( this.grid, newgrid, 0, 0 );
        return this;
      },

      next : function( wrap ) {
        this.grid = Life.next( this.grid, this.grid.cx, this.grid.cy, wrap );
        return this;
      },

      toggle : function( x, y ) {
        this.grid[x][y] ^= 1;
        return this;
      },

      scan : function( s ) {
        this.grid = Life.scan( s );
        return this;
      },

      format : function() {
        return Life.format( this.grid, this.grid.cx, this.grid.cy );
      },

      nothing : null

    };
    
    return self.init.apply( self, arguments );

  },


  // ----- Free functions ------

  // Return a empty grid (fill with dead cells).

  empty : function( cx, cy ) {

    var grid = [];

    for (x=0; x<cx; x++) {
      grid[x] = [];
      for (y=0; y<cy; y++) {
        grid[x][y] = 0;
      }
    }

    grid.cx = cx;
    grid.cy = cy;
    return grid;
  },


  // Return a randomized grid.

  random : function( cx, cy ) {

    var grid = [];

    for (x=0; x<cx; x++) {
      grid[x] = [];
      for (y=0; y<cy; y++) {
        grid[x][y] = (Math.random() < 0.5) ? 0 : 1;
      }
    }

    grid.cx = cx;
    grid.cy = cy;
    return grid;
  },


  // Copy a grid onto another grid, with some offset.

  copy : function( src, dst, x, y ) {

    for (x=0; x<src.cx && dst.x+x<dst.cx; x++)
      for (y=0; y<src.cy && dst_y+y<dst.cy; y++)
        dst[dst.x + x][dst.y + y] = src[x][y];

    return dst;
  },


  // Compute next iteration.

  next : function( grid, wrap ) {

    if (wrap == null)
      wrap = true;

    var newgrid = Life.empty( grid.cx, grid.cy );

    for (x=0; x<grid.cx; x++)
    {
      for (y=0; y<grid.cy; y++)
      {
        // Game of Life Rules:
        //  http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules

        switch (Life.neighbors( grid, wrap, x, y ))
        {
          // rule #1 : under-population (n < 2).
          case 0:
          case 1:
            newgrid[x][y] = 0;
            break;

          // rule #2 : continues to live (alive, n = 2 or 3).
          // rule #3 : birth (dead, n = 3).
          case 2:
            newgrid[x][y] = grid[x][y];
            break;
          case 3:
            newgrid[x][y] = 1;
            break;

          // rule #4 : overpopulation (n > 3).
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
            newgrid[x][y] = 0;
            break;
        }
      }
    }

    return newgrid;
  },


  // Count the number of live neighbors around a cell.

  neighbors : function( grid, wrap, x, y ) {

    var count = 0;

    for (dx=-1; dx<=1; dx++)
    {
      for (dy=-1; dy<=1; dy++)
      {
        var nx = x + dx;
        var ny = y + dy;
        if (wrap)
        {
          if (nx < 0) nx += grid.cx;
          if (ny < 0) ny += grid.cy;
          nx = nx % grid.cx;
          ny = ny % grid.cy;
        }
        if (nx < 0 || nx >= grid.cx || ny < 0 || ny >= grid.cy)
          continue;
        count += grid[nx][ny];
      }
    }

    count -= grid[x][y];

    return count;
  },


  // Render grid to string.

  format : function( grid ) {
    var s = '';
    for (y=0; y<grid.cy; y++) {
      for (x=0; x<grid.cx; x++)
        s += grid[x][y] ? '*' : '.';
      if (y<grid.cy-1)
        s += '\n';
    }
    return s;
  },


  // Parse grid from string.

  scan : function( s ) {
    var lines = s.split('\n');
    for (i=0; i<lines.length; i++)
      lines[i] = lines[i].split('');
    if (lines.length == 0)
      return [ [[]], 0, 0 ];
    var cx = lines[0].length;
    var cy = lines.length;
    var grid = [];
    for (x=0; x<cx; x++) {
      grid[x] = [];
      for (y=0; y<cy; y++)
        grid[x][y] = (lines[y][x] == '*') ? 1 : 0;
    }
    grid.cx = cx;
    grid.cy = cy;
    return grid;
  },


  nothing : null

};

