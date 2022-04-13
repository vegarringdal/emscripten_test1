
#include <vector>

namespace Modifier
{
    struct Vec3
    {
        double x, y, z;
    };

    struct Triangle
    {
        int v[3];
    };

    struct Vertex
    {
        Vec3 p;
    };

    std::vector<Triangle> triangles;
    std::vector<Vertex> vertices;

    void read(int *index, int indexSize, float *positions, int positionSize)
    {
        triangles.clear();
        vertices.clear();

        int l = indexSize / 3;
        for (int i = 0; i < l; i++)
        {
            Triangle t;
            int x = i * 3;
            t.v[0] = index[x];
            t.v[1] = index[x + 1];
            t.v[2] = index[x + 2];
            triangles.push_back(t);
        }

        for (int i = 0; i < indexSize; i++)
        {
            Vertex v;
            int pos = index[i];
            v.p.x = positions[pos];
            v.p.y = positions[pos + 1];
            v.p.z = positions[pos + 2];
            vertices.push_back(v);
        }
    }

    void fill(int *index, float *positions)
    {
        for (int i = 0; i < triangles.size(); i++)
        {
            int x = i * 3;
            index[x] = triangles[i].v[0];
            index[x + 1] = triangles[i].v[1];
            index[x + 2] = triangles[i].v[2];
        }

        for (int i = 0; i < vertices.size(); i++)
        {
            int x = i * 3;
            positions[x] = vertices[i].p.x;
            positions[x + 1] = vertices[i].p.y;
            positions[x + 2] = vertices[i].p.z;
        }
    }

    int getTriangeSize()
    {
        return triangles.size() * 3;
    }

    int getVertexSize()
    {
        return vertices.size() * 3;
    }

}
