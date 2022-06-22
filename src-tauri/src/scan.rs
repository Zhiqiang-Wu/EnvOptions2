use winapi::um::winuser;
use tauri::command;
use winapi::shared::minwindef::BYTE;
use winapi::um::winnt::SHORT;

unsafe fn keybd_event(b_vk: u32, shift: bool) {
    if shift {
        winuser::keybd_event(winuser::VK_SHIFT as BYTE, 0, 0, 0);
    }
    winuser::keybd_event(b_vk as BYTE, 0, 0, 0);
    winuser::keybd_event(b_vk as BYTE, 0, winuser::KEYEVENTF_KEYUP, 0);
    if shift {
        winuser::keybd_event(winuser::VK_SHIFT as BYTE, 0, winuser::KEYEVENTF_KEYUP, 0);
    }
}

#[command]
pub fn scan_key_press(str: String) {
    unsafe {
        for c in str.chars() {
            if c.is_lowercase() {
                // 小写
                let is_upper_case_status: SHORT = winuser::GetKeyState(winuser::VK_CAPITAL);
                keybd_event(c as u32 - 32, is_upper_case_status == 1);
            } else if c.is_uppercase() {
                // 大写
                let is_upper_case_status: SHORT = winuser::GetKeyState(winuser::VK_CAPITAL);
                keybd_event(c as u32, !(is_upper_case_status == 1));
            } else {
                match c as u32 {
                    // )
                    41 => keybd_event(0x30, true),
                    // !
                    33 => keybd_event(0x31, true),
                    // @
                    64 => keybd_event(0x32, true),
                    // #
                    35 => keybd_event(0x33, true),
                    // $
                    36 => keybd_event(0x34, true),
                    // %
                    37 => keybd_event(0x35, true),
                    // ^
                    94 => keybd_event(0x36, true),
                    // &
                    38 => keybd_event(0x37, true),
                    // *
                    42 => keybd_event(0x38, true),
                    // (
                    40 => keybd_event(0x39, true),
                    // +
                    43 => keybd_event(winuser::VK_OEM_PLUS as u32, true),
                    // _
                    95 => keybd_event(winuser::VK_OEM_MINUS as u32, true),
                    // ~
                    126 => keybd_event(winuser::VK_OEM_3 as u32, true),
                    // =
                    61 => keybd_event(winuser::VK_OEM_PLUS as u32, false),
                    // -
                    45 => keybd_event(winuser::VK_OEM_MINUS as u32, false),
                    // :
                    58 => keybd_event(winuser::VK_OEM_1 as u32, true),
                    // "
                    34 => keybd_event(winuser::VK_OEM_7 as u32, true),
                    // <
                    60 => keybd_event(winuser::VK_OEM_COMMA as u32, true),
                    // >
                    62 => keybd_event(winuser::VK_OEM_PERIOD as u32, true),
                    // ?
                    63 => keybd_event(winuser::VK_OEM_2 as u32, true),
                    // {
                    123 => keybd_event(winuser::VK_OEM_4 as u32, true),
                    // }
                    125 => keybd_event(winuser::VK_OEM_6 as u32, true),
                    // |
                    124 => keybd_event(winuser::VK_OEM_5 as u32, true),
                    // /
                    47 => keybd_event(winuser::VK_OEM_2 as u32, false),
                    _ => keybd_event(c as u32, false)
                }
            }
        }
    }
}
