#pragma once

#define FIXED_SCHEMA_PATH "/usr/local/share/parasolid/schema"

void FSTART(int *ifail);
void FSTOP(int *ifail);
void FMALLO(int *nbytes, char **memory, int *ifail);
void FMFREE(int *nbytes, char **memory, int *ifail);
void FFOPRD(const int *guise, const int *format, const char *name,
            const int *namlen, const int *skiphd, int *strid,
            int *ifail);
void FFOPWR(const int *guise, const int *format, const char *name,
            const int *namlen, const char *pd2hdr, const int *pd2len,
            int *strid, int *ifail);
void FFOPRB(const int *guise, const int *minsiz, const int *maxsiz,
            int *actsiz, int *strid, int *ifail);
void FFWRIT(const int *guise, const int *strid, const int *nchars,
            const char *buffer, int *ifail);
void FFREAD(const int *guise, const int *strid, const int *nmax,
            char *buffer, int *nactual, int *ifail);
void FFTELL(const int *guise, const int *strid, int *pos, int *ifail);
void FFSEEK(const int *guise, const int *strid, const int *pos,
            int *ifail);
void FFCLOS(const int *guise, const int *strid, const int *action,
            int *ifail);
void FABORT(int *ifail);
void FTMKEY(int *guise, int *format, int *index, char name[],
            int *namlen, int *ifail);
