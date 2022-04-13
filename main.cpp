
#include "Simplify.h"

extern "C"
{
    void read(int *index, int indexSize, float *positions, int positionSize, bool debug = false)
    {
        Simplify::read(index, indexSize, positions, positionSize, debug);
    }

    void simplify_mesh(double target_count = 10, double agressiveness = 7.0, bool verbose = true)
    {
        Simplify::simplify_mesh(target_count, agressiveness, verbose);
        // todo: error checking
        // I prob should return int for success/error + new sizes?
        // or just own function for status ?
    }

    void fill(int *index, float *positions, bool debug = true)
    {
        // this prob could have been done in the read part
        Simplify::fill(index, positions, debug);
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
