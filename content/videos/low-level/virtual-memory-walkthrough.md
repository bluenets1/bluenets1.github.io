**Summary.** Every pointer you've ever dereferenced was a *lie* — a virtual address the MMU translates to physical memory through page tables. This video walks through that translation live in a debugger.

## key points

- virtual addresses are split into indices into a multi-level page table
- the CPU caches translations in the TLB; a miss triggers a page walk
- the same virtual address means different physical memory in each process

```c
// two processes, same address, different memory
char *p = (char *)0x400000;   // maps to different frames per process
```

Watch the video for the page-walk on real addresses.
