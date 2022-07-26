include(fb.ProfilePath + 'themes\\eole\\js\\JStheme_common.js');
window.DefinePanel('LyricsDiv', { author: 'Timmy Fox', version: 1.2, features: { drag_n_drop: false } });

let ww = 0;
let wh = 0;
const h = 80;
const divWidth = 300;

var eslScripts = true;
try {
	var esl = new ActiveXObject("ESLyric");
	var eslPanel = esl.GetAll();
}

catch (ex) {
	eslScripts = false;
}

if (eslScripts) {
	eslPanel.SetTextFont("Segoe UI", 16, 0);
	eslPanel.SetTextAlign(1);
	eslPanel.SetVertMargin(0);
	eslPanel.SetHorizMargin(4);
	eslPanel.SetLineSpace(2);
	eslPanel.SetSentenceSpace(8);
	eslPanel.SetVariesFontDeltaHeight(5);
}

var bg_light = gdi.Image(theme_img_path + "\\sidepanel\\bgLight.png");
var bg_dark = gdi.Image(theme_img_path + "\\sidepanel\\bgDark.png");
var div_light = gdi.Image(theme_img_path + "\\sidepanel\\divLight.png");
var div_dark = gdi.Image(theme_img_path + "\\sidepanel\\divDark.png");

properties = {
	panelName: 'Lyrics_divider',
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
}

function on_size(width, height) {
	ww = width;
	wh = height;
}

function on_paint(gr) {
	if (eslScripts) {
		if (properties.darklayout) {
			eslPanel.SetTextColor(GetGrey(255));
			eslPanel.SetTextHighlightColor(RGB(75, 165, 255));
			eslPanel.SetBackgroundColor(GetGrey(30));
		}

		else {
			eslPanel.SetTextColor(GetGrey(0));
			eslPanel.SetTextHighlightColor(RGB(0, 128, 255));
			eslPanel.SetBackgroundColor(GetGrey(255));
		}
	}

	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
	if (fb.IsPlaying) {
		if (properties.darklayout)
			gr.DrawImage(div_dark, 0, 0, ww, wh, 0, 0, divWidth, wh);
		else
			gr.DrawImage(div_light, 0, 0, ww, wh, 0, 0, divWidth, wh);
	}

	else {
		if (properties.darklayout)
			gr.DrawImage(bg_dark, 0, 0, ww, wh, 0, 0, divWidth, wh);
		else
			gr.DrawImage(bg_light, 0, 0, ww, wh, 0, 0, divWidth, wh);
	}

	if (!eslScripts) {
		gr.GdiDrawText("ESLyric scripts are disabled!\nEnable scripts by setting 'pref.script.expose' to '1'\nin Preferences > Tools > ESlyric > Advanced and\nrestarting Foobar2000.\nClick here to open preferences...", gdi.Font("segoe ui", 12, 1), RGB(255,0,0), 10, 0, ww, wh, DT_TOP | DT_LEFT | DT_END_ELLIPSIS | DT_NOPREFIX);
	}
}

function on_mouse_lbtn_down(x,y){
	if(!eslScripts) {
		fb.ShowPreferences();
	}
}

function on_playback_new_track() {
	window.Repaint();
}

function on_playback_stop() {
	window.Repaint();
}

function on_notify_data(name, info) {
	switch (name) {
		case "WSH_panels_reload":
			window.Reload();
			break;
		case "bio_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			window.Repaint();
			break;
	}
}