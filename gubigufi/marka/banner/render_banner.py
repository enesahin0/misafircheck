from playwright.sync_api import sync_playwright
import pathlib, sys
p = pathlib.Path(__file__).parent.resolve()
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 2048, 'height': 1152})
    pg.goto((p / 'banner.html').as_uri()); pg.wait_for_timeout(400)
    pg.screenshot(path=str(p / 'gubigufi_banner_2048x1152.png'))
    b.close()
print('ok')
