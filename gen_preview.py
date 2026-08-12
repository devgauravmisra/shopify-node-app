# Builds public/ui-preview.html using guillemet placeholders to avoid tag-stripping
# Run: python3 gen_preview.py

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f1f2f4;color:#202223;font-size:14px}
.admin-bar{background:#1a1a2e;color:#fff;height:52px;display:flex;align-items:center;padding:0 24px;gap:14px;position:sticky;top:0;z-index:100}
.logo{font-weight:700;font-size