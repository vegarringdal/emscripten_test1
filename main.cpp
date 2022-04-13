
#include "Simplify.h"

extern "C"
{
    void read(int *index, int indexSize, float *positions, int positionSize)
    {
        Simplify::read(index, indexSize, positions, positionSize);
        double agressiveness = 7.0;
        int target_count = 10;
        Simplify::simplify_mesh(target_count, agressiveness, true);
        // todo: error checking
        // I prob should return int for success/error + new sizes?
        // or just own function for status ?
    }
   

    void fill(int *index, float *positions)
    {
        // this prob could have been done in the read part
        Simplify::fill(index, positions);
    }

    int getTriangeSize()
    {
        return Simplify::getTriangeSize();
    }

    int getVertexSize()
    {
        return Simplify::getVertexSize();
    }
}
