package com.avnet.multipart;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.wink.json4j.JSON;
import org.apache.wink.json4j.JSONException;
import org.apache.wink.json4j.JSONObject;
import org.mozilla.javascript.Scriptable;

public class BuildMultiPartData extends MultipartEntity{

//	MultipartEntityBuilder builder = MultipartEntityBuilder.create();
//	
	static public String fromJSONObject(Scriptable json) {
		BuildMultiPartData body = new BuildMultiPartData();
		for(Object key : json.getIds()) {
		Object value = json.get((String)key,json);
		StringBody part;
		try {
		part = new StringBody(value.toString());
		body.addPart((String)key, part);
		} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		}
		}
		return body.toString();
		}
	
	public String toString() {
		String result = "";
		OutputStream output = new java.io.ByteArrayOutputStream();
		try {
		writeTo(output);
		result = output.toString();
		} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		}
		return result;
		}
	
}
