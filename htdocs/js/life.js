var Life = 
{
  // ----- Class -----

  life : function()
  {
    var obj = {    

      init : function() {
        var self = this;

        if (arguments.length == 1)
        {
          self.scan( arguments[0] );
        }
        else if (arguments.length == 2)
        {
          self.cx = arguments[0];
          self.cy = arguments[1];
          self.grid = Life.clear( self.cx, self.cy );
        }
        return self;
      },

      clear : function() {
        this.grid = Life.clear( this.cx, this.cy );
        return this;
      },

      next : function() {
        this.grid = Life.next( this.grid, this.cx, this.cy );
        return this;
      },

      toggle : function( x, y ) {
        this.grid[x][y] ^= 1;
        return this;
      },

      scan : function( s ) {
        var o = Life.scan( s );
        this.grid = o[0];
        this.cx = o[1];
        this.cy = o[2];
        return this;
      },

      format : function() {
        return Life.format( this.grid, this.cx, this.cy );
      },

      nothing : null
    };

    return obj.init.apply( obj, arguments );
  },

  // ----- Free functions ------

  // Return a clear grid (fill with dead cells).

  clear : function( cx, cy ) {

    var grid = [];

    for (x=0; x<cx; x++) {
      grid[x] = [];
      for (y=0; y<cy; y++) {
        grid[x][y] = 0;
      }
    }

    return grid;
  },


  // Compute next iteration.

  next : function( grid, cx, cy ) {

    var neighbors = [
      [ -1, -1  ],
      [  0, -1  ],
      [  1, -1  ],
      [ -1,  0  ],
      [  1,  0  ],
      [ -1,  1  ],
      [  0,  1  ],
      [  1,  1  ]
    ];

    var newgrid = Life.clear( cx, cy );

    for (x=0; x<cx; x++)
    {
      for (y=0; y<cy; y++)
      {
        var livecount = 0;

        for (d=0; d<neighbors.length; d++)
        {
          var nx = x + neighbors[d][0];
          var ny = y + neighbors[d][1];
          if (nx < 0 || nx >= cx || ny < 0 || ny >= cy)
            continue;
          livecount += grid[nx][ny];
        }

        // Game of Life Rules:
        //  http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules

        switch (livecount)
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


  // Render grid to string.

  format : function( grid, cx, cy ) {
    var s = '';
    for (y=0; y<cy; y++) {
      for (x=0; x<cx; x++)
        s += grid[x][y] ? '*' : '.';
      if (y<cy-1)
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
    return [ grid, cx, cy ];
  },


  nothing : null

};

