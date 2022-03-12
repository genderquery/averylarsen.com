---
title: Digging Into IPFS
tags:
  - IPFS
date: 2019-08-15 18:07:19
---

I've been playing around with [IPFS (the InterPlanetary File System)][ipfs]
which describes itself as "[a] peer-to-peer hypermedia protocol to make the
web faster, safer, and more open." I had some questions that weren't easily
answered in the [IPFS documentation][ipfsdocs]. In this article, I'll be going
over some of those questions and how I answered them through exploration.

[ipfs]: https://ipfs.io/ "IPFS is the Distributed Web"
[ipfsdocs]: https://docs.ipfs.io/ "IPFS Documentation"

<!-- more -->

I'm going to assume you have a rough idea of what IPFS is and why you would
want to use it, but if not, [read the overview][overview] first. If you want
to follow along with the commands, you'll need the following packages:
[base58], [bsdmainutils], [openssl], [protobuf-compiler], [jq].

[overview]: https://docs.ipfs.io/introduction/overview/ "What is IPFS? – IPFS Documentation"
[base58]: https://packages.debian.org/stable/base58 "Debian -- Details of package base58 in buster"
[bsdmainutils]: https://packages.debian.org/stable/bsdmainutils "Debian -- Details of package bsdmainutils in buster"
[openssl]: https://packages.debian.org/stable/openssl "Debian -- Details of package openssl in buster"
[protobuf-compiler]: https://packages.debian.org/buster/protobuf-compiler "Debian -- Details of package protobuf-compiler in buster"
[jq]: https://packages.debian.org/buster/jq "Debian -- Details of package jq in buster"

## Getting Started

This is covered in more depth on the [Getting Started page of the IPFS
documentation][gettingstarted], but I will summarize here for the sake of
completeness.

[gettingstarted]: https://docs.ipfs.io/introduction/usage/ "Getting Started – IPFS Documentation"

[Download go-ipfs][goipfs] and move the binary somewhere in your `$PATH`, such
as `/usr/local/bin` or my preference, `$HOME/.local/bin`:

[goipfs]: https://dist.ipfs.io/#go-ipfs "IPFS Distributions"

```
$ tar -xf go-ipfs_*.tar.gz
$ cp go-ipfs/ipfs $HOME/.local/bin
```

Run `ipfs init` to initialize your repository. This is where IPFS will store
all the data for your node:

```
$ ipfs init
initializing ipfs node at /home/avery/.ipfs
generating 2048-bit RSA keypair...done
peer identity: QmaT8goMguQ4MxGZGfHjhFmiASq1FF8pAkCtfpTMXiAAZW
to get started, enter:

  ipfs cat /ipfs/QmaT8goMguQ4MxGZGfHjhFmiASq1FF8pAkCtfpTMXiAAZW/readme
```

A <dfn>node</dfn> is a network-addressable server that will talk to other
nodes, called <dfn>peers</dfn>, in the network to handle requests for data.

Before we can access the IPFS network, we need to start the daemon using `ipfs daemon`. I have mine start automatically via a Systemd user service I adapted
from the [ArchLinux IPFS Wiki entry][archipfs]:

`$HOME/.config/systemd/user/ipfs.service`

```
[Unit]
Description=IPFS daemon
After=network.target

[Service]
ExecStart=%h/.local/bin/ipfs daemon
Restart=on-failure

[Install]
WantedBy=default.target
```

Enable and start the service:

```
$ systemctl --user enable --now ipfs
```

Or just run the daemon directly:

```
$ ipfs daemon
```

[archipfs]: https://wiki.archlinux.org/index.php/IPFS#Using_a_service_to_start_the_daemon "IPFS - ArchWiki"

## Content Identifiers

Content on the IPFS network is addressed using a <dfn>content identifier</dfn>
(CID) which is derived from the hash of the content.

When you add a file, you'll get back a CID:

```
$ echo "hello world" > hello.txt
$ ipfs add --quiet hello.txt
QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o
```

There's two different formats for CIDs, but I'm only going to discuss the more
common version 0, which always starts with `Qm`. A CID is a Base58-encoded
[multihash][multihash] that describes the hash algorithm used, the length of
the hash, and then the hash itself. Let's decode the CID into hexadecimal:

[multihash]: https://github.com/multiformats/multihash "multiformats/multihash: Self describing hashes - for future proofing"

```
$ echo "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o" |
  base58 -d |
  hexdump -e '"0x" 18/1 "%02x" "\n      " 16/1 "%02x" "\n"'
0x122046d44814b9c5af141c3aaab7c05dc5e8
      44ead5f91f12858b021eba45768b4c0e
```

The first byte, `0x12`, tells us that this a SHA-256 hash. The possible values
are listed in this [table on the multicodec repo][table]. The `0x20` (32 in
decimal) tells us it's 32 bytes (256 bits) long. The rest of it is the SHA-256
hash itself.

[table]: https://github.com/multiformats/multicodec/blob/master/table.csv "multicodec/table.csv at master · multiformats/multicodec"

As I mentioned, version 0 CIDs always start with `Qm`, so what that means is
they will always be SHA-256 hashes. It may seem redundant, but this was done
to provide a bit of future-proofing in case the hash algorithm needed to be
changed.

That leaves us with the remainder of the address which is just the hash of the
content, `46d44814b9c5af141c3aaab7c05dc5e844ead5f91f12858b021eba45768b4c0e`.

```
$ openssl sha256 hello.txt
SHA256(hello.txt)= a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447
```

Huh. That doesn't match. So what is the content that the hash is of?

## Objects

When we added the file `hello.txt`, it's content wasn't simply added as raw
data. `ipfs block ` lets us take a look at the contents of a raw block:

```
$ ipfs block get QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o |
  hexdump -e '8/1 "%02x " "  "' -e '8/1 "%_p" "\n"'
0a 12 08 02 12 0c 68 65  ......he
6c 6c 6f 20 77 6f 72 6c  llo worl
64 0a 18 0c              d...
```

Alright, we can see our "hello world" in there, but what's the rest of it?
IPFS uses [Merkle tree][merkle]-like structures called "merkledags" or just
"DAGs" as <dfn>objects</dfn>. These objects are encoded as [protocol
buffers][protobuf]. Using `protoc`, we can decode it:

[merkle]: https://en.wikipedia.org/wiki/Merkle_tree "Merkle tree - Wikipedia"
[protobuf]: https://developers.google.com/protocol-buffers/ "Protocol Buffers  |  Google Developers"

```
$ ipfs block get QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o |
  protoc --decode_raw
1 {
  1: 2
  2: "hello world\n"
  3: 12
}
```

If we look at the [`merkledag.proto`][merkledagproto] definition, we can see
that the outer field number `1` is "Data". Because we added a file, we know
this is a [UnixFS][unixfs] object.

[merkledagproto]: https://github.com/ipfs/go-merkledag/blob/a56cbf989dec0b9b752a47ba4e11463bdb83a821/pb/merkledag.proto "go-merkledag/merkledag.proto at a56cbf989dec0b9b752a47ba4e11463bdb83a821 · ipfs/go-merkledag"
[unixfs]: https://docs.ipfs.io/guides/concepts/unixfs/ "UnixFS – IPFS Documentation"

Looking at the [`unixfs.proto`][merkledagproto] definition, field `1`
corresponds to `DataType`, which in this case is `File` (`2`). Field `2` is
our data, the text of the document. Field `3` is the `filesize`, 12 bytes.

[unixfsproto]: https://github.com/ipfs/go-unixfs/blob/1000cfd8959cc21b553b44c8e41abc8d21a9ee08/pb/unixfs.proto "go-unixfs/unixfs.proto at 1000cfd8959cc21b553b44c8e41abc8d21a9ee08 · ipfs/go-unixfs"

Going back to our question earlier about what content is actually hashed, it's
the entire raw block.

```
$ ipfs block get QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o |
  openssl sha256
(stdin)= 46d44814b9c5af141c3aaab7c05dc5e844ead5f91f12858b021eba45768b4c0e
```

## Big Files

We looked at a very simple object containing a small file, but objects can
link to other objects using their CID to form larger sets of data.

I'm going to add this Debian installer disk image:

```
$ ipfs add --quiet ~/Downloads/debian-9.6.0-amd64-netinst.iso
Qma2qJEp4wWtksnvAY3msyT1w2JFRPKjEdr3WkLsNGHJbF
```

Instead of looking at the low-level protocol buffer encoding, we'll use `ipfs object get` to do a little bit of decoding for us:

```
$ ipfs object get Qma2qJEp4wWtksnvAY3msyT1w2JFRPKjEdr3WkLsNGHJbF | jq .
{
  "Links": [
    {
      "Name": "",
      "Hash": "QmTGA5qUAbkUDdRMWZucmfSRJxpMGYfD4aR8pdhidUa75d",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmSLK3HyD5i78Ad24pjDZBoYPKvXCq7xM5p1VmWPJzTBnN",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmNdvLwwspM92gRroDDtSWo6MudapBE2TFMAE97xj964aN",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmV8akAbA4Bm8azUaBaEtyf9TE7d71NVxVL38mWZjLZpKs",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmbspCq1SjNPqPRr3yCCHmYeMVC4D6FsZenqNbLFn9kyMB",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmXhoJpA49eH7FygVHs8uZAYA1B95hWcPag9W84FeWJnXs",
      "Size": 45623854
    },
    {
      "Name": "",
      "Hash": "QmXEveBHyyZLb5ZCM8ewYWdYdh7DtizhdaChkpQPBu17tu",
      "Size": 31464730
    }
  ],
  "Data": "\b\u0002\u0018����\u0001 ���\u0015 ���\u0015 ���\u0015 ���\u0015 ���\u0015 ���\u0015 ���\u000f"
```

We can see the file was split up into multiple blocks and each part get it's
own CID. The `Data` field just contains some information about the total size
of the file.

## UnixFS

The ability to link content together in a tree structure lends well to using
IPFS like a file system. If we add a directory, recursively, it will create
objects with the same structure:

```
$ ipfs add -r themes/landscape
added Qmc27n1EhfiCq6dZu4TyrdUtoHBcKzMYBZcfV8SEt1CCAW landscape/LICENSE
added QmVCPij5GhKKZm2QmNWSbZU53RjY3hW6QAo33upMpKCbNK landscape/README.md
added QmUmZkFjnt3tmgKwN5Hc2eD2zEm6E1CLAavveskmBRESH9 landscape/_config.yml
# snip
added QmVCovLyHFgCzGLpoDukfsKGVamZMBu27hGFysuxcpCKhb landscape/source/js
added QmSh99jvHA4NkWULrYsBBiP8sCYJQ54H4EoCRHrtRdgVYB landscape/source
added QmbcND1QgCVkcBNJWPBUpZhPpXh5fWnpz9L9Qun2tuP3zD landscape
```

We can list the child objects with `ipfs ls`:

```
$ ipfs ls QmbcND1QgCVkcBNJWPBUpZhPpXh5fWnpz9L9Qun2tuP3zD/source
QmU1rLAeQogXNLXN1rM9gKKrvrZbSpocCHuxqZNhu39By7 - css/
QmSEX5GkTGEKxXbzVuacoRtZXHpRY5mWVxbqPBJovKrY7v - fancybox/
QmVCovLyHFgCzGLpoDukfsKGVamZMBu27hGFysuxcpCKhb - js/
```

And use `ipfs cat` to read out files:

```
$ ipfs cat QmbcND1QgCVkcBNJWPBUpZhPpXh5fWnpz9L9Qun2tuP3zD/package.json
{
  "name": "hexo-theme-landscape",
  "version": "0.0.2",
  "private": true
}
```

Neat!
