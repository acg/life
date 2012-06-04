var Life = 
{
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

  copy : function( src, dst, ox, oy ) {

    for (x=0; x<src.cx && x+ox<dst.cx; x++)
      for (y=0; y<src.cy && y+oy<dst.cy; y++)
        dst[ox + x][oy + y] = src[x][y];

    return dst;
  },


  // Return a new resized version of a grid.

  resize : function( grid, cx, cy ) {
    return Life.copy( grid, Life.empty( cx, cy ), 0, 0 );
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


  // Toggle a cell in a grid.

  toggle : function( grid, x, y ) {
    grid[x][y] ^= 1;
    return grid;
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

