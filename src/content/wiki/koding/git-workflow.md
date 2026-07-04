---
title: "Git Workflow untuk Proyek Personal"
description: "Strategi branching dan commit message yang efektif buat proyek sendirian atau tim kecil."
createdAt: 2026-07-04
updatedAt: 2026-07-04
tags: ["git", "version-control", "workflow"]
isPinned: false
growthStage: "seedling"
---

## Git Workflow untuk Proyek Personal

Gak perlu ribet kayak GitFlow kalo cuma sendiri atau tim 2-3 orang. Cukup pake yang simpel tapi tetap terstruktur.

### Branch Strategy Sederhana

```
main       — production-ready, yang di-deploy
dev        — integration buat fitur yang lagi jalan
feat/*     — fitur baru, branch dari dev
fix/*      — perbaikan bug, branch dari dev
chore/*    — urusan tooling, config, dependency
```

### Commit Message

Pake conventional commits biar historinya rapi dan bisa auto-generate changelog.

```
feat: add user authentication
fix: handle empty state on profile page
chore: upgrade dependencies
docs: update README setup guide
```

### Tips

- **Commit sering, push tiap selesai sesi.** Biar gak kehilangan progress.
- **Rebase sebelum merge.** Biar history linear dan gampang di-track.
- **Jangan commit file .env atau rahasia.** Udah pusing sendiri kalo bocor.
