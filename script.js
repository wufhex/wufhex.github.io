const g_asciiArt = `
     .--.       _
    |o_o |     | |
    |:_/ |     | |
   //  \\  \\    | |
  (|    |  )    ‾  
 /'\\_   _/'\\   (_)
 \\___)=(___/
 
[    3.206112] Kernel panic - not syncing: Scratch register read error! Expected: 0x12345678 but got: 0x78000000
[    3.207631] CPU: 0 PID: 1 Comm: swapper Not tainted 5.0.0 #1
[    3.208444] Call Trace:
[    3.209221] [<c0027498>] walk_stackframe+0x0/0xfc
[    3.210232] [<c00276cc>] show_stack+0x3c/0x50
[    3.211196] [<c044c5bc>] dump_stack+0x2c/0x3c
[    3.212131] [<c002b2e0>] panic+0x11c/0x288
[    3.213128] [<c023e000>] litex_soc_ctrl_probe+0x200/0x210
[    3.214256] [<c02b2fe0>] platform_drv_probe+0x44/0x84
[    3.215285] [<c02b1040>] really_probe+0xd8/0x2a0
[    3.216267] [<c02b1630>] driver_probe_device+0x4c/0x1dc
[    3.217315] [<c02b18d8>] __driver_attach+0x118/0x130
[    3.218316] [<c02af1e8>] bus_for_each_dev+0x74/0xb8
[    3.219316] [<c02b1a8c>] driver_attach+0x28/0x38
[    3.220276] [<c02afd74>] bus_add_driver+0x1f8/0x224
[    3.221277] [<c02b225c>] driver_register+0x6c/0x154
[    3.222316] [<c02b3f50>] __platform_driver_register+0x4c/0x5c
[    3.223468] [<c000f5dc>] litex_soc_ctrl_driver_init+0x24/0x34
[    3.224565] [<c0000d80>] do_one_initcall+0x64/0x14c
[    3.225548] [<c0000fa8>] kernel_init_freeable+0x140/0x1f4
[    3.226666] [<c0467cc8>] kernel_init+0x1c/0x114
[    3.227666] [<c0026238>] ret_from_exception+0x0/0x10
[    3.228548] ---[ end Kernel panic - not syncing: Scratch register read error! Expected: 0x12345678 but got: 0x78000000 ]---
`

function attachTuxContainer() {
    const container = document.getElementById('tux-crash-container');
    container.textContent = g_asciiArt;
}

// From starfield.js
initStars();
animateStars();

// From plasma.js
animatePlasma();

attachTuxContainer();