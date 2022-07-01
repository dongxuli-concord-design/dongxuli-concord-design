#pragma once

#include <vector>

class GoInterface {
 public:

  static void resetBuffers();

  static void ProcessSegment(
      const int *segtyp,
      const int *ntags,
      const int *tags,
      const int *ngeoms,
      const double *geoms,
      const int *nlntp,
      const int *lntp,
      int *ifail
  );

  static void OpenSegment(
      const int *segtyp,
      const int *ntags,
      const int *tags,
      const int *ngeoms,
      const double *geoms,
      const int *nlntp,
      const int *lntp,
      int *ifail
  );

  static void CloseSegment(
      const int *segtyp,
      const int *ntags,
      const int *tags,
      const int *ngeoms,
      const double *geoms,
      const int *nlntp,
      const int *lntp,
      int *ifail
  );

};
