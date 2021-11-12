//===================================================
//============QQ Music Source For ESLyric============
//================Anonymous 2017-01-04===============
//===================================================

var debug = false; // 如果要调试的话，改为 true.
var ado = new ActiveXObject("ADODB.Stream");
var xmlDoc = new ActiveXObject("MSXML.DOMDocument");
var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.6.0");

function get_my_name() {
	return "QQ Music|QQ 音乐";
}

function get_version() {
	return "0.1.0";
}

function get_author() {
	return "Anonymous";
}

function start_search(info, callback) {

    var url;
	var title = info.Title;
	var artist = info.Artist;

    // New method instead of xmlhttp...
    var http_client = utils.CreateHttpClient();

    url = generate_url(title, artist, true, -1);
	debug && console(url);
    var json_txt = http_client.Request(url);
    if (http_client.StatusCode != 200) {
        console("Request url[" + url + "] error : " + http_client.StatusCode);
        return;
    }
    var _new_lyric = callback.CreateLyric();
    // parse json_txt
    //debug && console(json_txt);
    var data = json(json_txt)["data"];
    debug && console("data.length == " + data.song.list[0].grp.length);
    // download lyric
    for (var j = 0; j < data.song.list[0].grp.length; j++) {
        if (callback.IsAborting()) {
            console("user aborted");
            break;
        }
        var daa = data.song.list[0].grp[j].f.split("|");
        debug && console("daa.length == " + daa.length);
        debug && console("daa == " + daa[0]+" "+daa[1]+" "+daa[3]+" "+daa[5]);
        
        url = generate_url(daa[3], daa[1], false, daa[0]);
        debug && console(url);
        try {
            xmlhttp.open("GET",url,false);
            xmlhttp.send();
        } catch (e) {
            continue;
        }
        // add to eslyric
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var xml_text = A2U(xmlhttp.responseBody);
            xmlDoc.loadXML(xml_text);
            var lr = xmlDoc.getElementsByTagName("lyric");
            if(lr.length == 0)continue;
            _new_lyric.LyricText = lr[0].childNodes[0].text;
            _new_lyric.Title = daa[1];
            _new_lyric.Artist = daa[3];
            _new_lyric.Album = daa[5];
            _new_lyric.Source = get_my_name();
            _new_lyric.Location = url,
            callback.AddLyric(_new_lyric);
            (j % 2 == 0) && callback.Refresh();
        }
    }
    _new_lyric.Dispose();

}

function generate_url(artist, title, query, song_id) {
    var url = "";
    if (query) {
        title = process_keywords(title);
        artist = process_keywords(artist);
        url = "http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=1&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=" + encodeURIComponent(title) + "+" + encodeURIComponent(artist);
    } else {
        url = "http://music.qq.com/miniportal/static/lyric/"+(song_id - (Math.floor(song_id/100)*100)).toString()+"/"+song_id+".xml"
    }
    return url;
}

function process_keywords(str) {
	var s = str;
	s = s.toLowerCase();
	s = s.replace(/\'|·|\$|\&|–/g, "");
	//truncate all symbols
	s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
	s = s.replace(/[-/:-@[-`{-~]+/g, "");
	s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
	return s;
}

function json(text) 
{
	try{
		var data=JSON.parse(text);
		return data;
	}catch(e){
		return false;
	}
}


function console(s) {
    fb.trace(get_my_name() + " $>  " + s);
};


function A2U(s){
	ado.Type = 1;
	ado.Open();
	ado.Write(s);
	ado.Position = 0;
	ado.Type = 2;
	ado.Charset = "gb2312";
	var ret = ado.ReadText();
	ado.Close();
	return ret;
}