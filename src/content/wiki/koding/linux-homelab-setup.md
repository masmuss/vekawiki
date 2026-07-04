---
title: "Dasar Setup Linux Homelab"
description: "Konfigurasi awal server Debian/Ubuntu buat homelab yang aman dan nyaman dipake."
createdAt: 2026-06-10
updatedAt: 2026-07-04
tags: ["linux", "homelab", "server", "devops"]
isPinned: false
growthStage: "budding"
---

## Dasar Setup Linux Homelab

Buat yang baru mulai homelab, ini langkah-langkah dasar yang pasti kepake.

### 1. SSH Key Authentication

Jangan pake password login. Generated key pair dan copy ke server.

```bash
ssh-keygen -t ed25519 -C "homelab-key"
ssh-copy-id user@server-ip
```

Terus matiin password auth di `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
PubkeyAuthentication yes
```

### 2. Firewall Sederhana dengan UFW

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw enable
```

### 3. Auto Security Updates

```bash
apt install unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. Docker dengan Rootless Mode

Biar container gak punya akses root ke host.

```bash
apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
systemctl enable --now docker
```

Catatan Terkait:
Lihat [[docker-best-practices]] buat tips keamanan container lebih lanjut.
