# Chrome Web Store Preparation Checklist
## 1. Testing & Validation
- [ ] **Core Functionality**:
    - [ ] Test Text input generation
    - [ ] Test URL input generation (current tab & manual)
    - [ ] Test Wi-Fi input generation
    - [ ] Test vCard input generation
- [ ] **History Management**:
    - [ ] Verify items are saved to history
    - [ ] Verify 'Load' function restores settings correctly
    - [ ] Verify Delete/Clear functionality
    - [ ] Verify Export JSON
- [ ] **Style & Customization**:
    - [ ] Test colors (Foreground/Background)
    - [ ] Test shapes (Square/Circle/Dot/etc.)
    - [ ] Test Logo upload and overlay
    - [ ] Test 'Reset to Defaults'
    - [ ] Test 'Save as Default'
- [ ] **Extension features**:
    - [ ] Verify popup opens and captures URL
    - [ ] Verify download (SVG/PNG) form popup
    - [ ] Verify 'Open Studio' link
- [ ] **Permissions**:
    - [ ] Confirm `storage`, `activeTab`, `downloads` usage is justified

## 2. Assets & Metadata
- [ ] **Icons**: Ensure 16, 32, 48, 128px icons are generated and look good.
- [ ] **Screenshots**: Take 1280x800 screenshots of:
    - [ ] Popup view
    - [ ] Studio dashboard (Content tab)
    - [ ] Studio dashboard (Style tab)
    - [ ] History page
- [ ] **Promotional Tiles**:
    - [ ] Small: 440x280
    - [ ] Large: 920x680
    - [ ] Marquee: 1400x560
- [ ] **Description**: Update store description with features from README.

## 3. Package
- [ ] Run `bun run build` one last time.
- [ ] Zip the `dist/` folder.
- [ ] Upload to CWS Developer Dashboard.

