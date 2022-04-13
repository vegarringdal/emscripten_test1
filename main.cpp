
#include "Modifier.h"

extern "C"
{
    void read(int *index, int indexSize, float *positions, int positionSize)
    {
        Modifier::read(index, indexSize, positions, positionSize);
    }

    void fill(int *index, float *positions)
    {
        Modifier::fill(index, positions);
    }

    int getTriangeSize()
    {
        return Modifier::getTriangeSize();
    }

    int getVertexSize()
    {
        return Modifier::getVertexSize();
    }
}
