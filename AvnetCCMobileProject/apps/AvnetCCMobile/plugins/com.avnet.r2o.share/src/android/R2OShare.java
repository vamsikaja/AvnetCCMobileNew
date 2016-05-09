package com.avnet.r2o.share;

import java.io.File;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.DownloadManager;
import android.app.DownloadManager.Query;
import android.app.DownloadManager.Request;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore.MediaColumns;
import android.util.Log;
import android.webkit.MimeTypeMap;

public class R2OShare extends CordovaPlugin {
	public static final String TAG = "R2OShare";
	public static String extension = "";
	CallbackContext callbackContext;
	String action;
	DownloadManager dm;
	long enqueue;

	BroadcastReceiver receiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String actn = intent.getAction();
			if (DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(actn)) {
				callbackContext.success();
				long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, 0);
				Query query = new Query();
				query.setFilterById(enqueue);
				Cursor c = dm.query(query);
				if (c.moveToFirst()) {
					int columnIndex = c.getColumnIndex(DownloadManager.COLUMN_STATUS);
					if (DownloadManager.STATUS_SUCCESSFUL == c.getInt(columnIndex)) {
						String uriString = c.getString(c.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI));
						Uri screenshotUri = Uri.parse(uriString);						
						String filePath = getFilePathFromUri(R2OShare.this.cordova.getActivity(),screenshotUri);
						Uri newUri = Uri.parse("file://"+ filePath);
						MimeTypeMap mime = MimeTypeMap.getSingleton();				        
						String type = mime.getMimeTypeFromExtension(R2OShare.extension);
						Log.d("Action", action);
						if("shareItem".equals(action)){
							Intent i = new Intent(android.content.Intent.ACTION_SEND);
							i.putExtra(android.content.Intent.EXTRA_SUBJECT,"R2O Share");
							i.setType(type);
							i.putExtra(Intent.EXTRA_STREAM, newUri);
							R2OShare.this.cordova.getActivity().startActivity(Intent.createChooser(i, "Share via"));
						}else if("open".equals(action)){
							Intent i = new Intent(android.content.Intent.ACTION_VIEW);
							i.setDataAndType(newUri,type);
							i.putExtra(Intent.EXTRA_STREAM, newUri);
							R2OShare.this.cordova.getActivity().startActivity(Intent.createChooser(i, "Open with"));
						}
					}
				}
			}else{
				callbackContext.error("");
			}
		}
	};

	public static String getFilePathFromUri(Context c, Uri uri) {
		String filePath = null;
		if ("content".equals(uri.getScheme())) {
			String[] filePathColumn = { MediaColumns.DATA };
			ContentResolver contentResolver = c.getContentResolver();
			Cursor cursor = contentResolver.query(uri, filePathColumn, null,
					null, null);
			cursor.moveToFirst();
			int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
			filePath = cursor.getString(columnIndex);
			cursor.close();
		} else if ("file".equals(uri.getScheme())) {
			filePath = new File(uri.getPath()).getAbsolutePath();
		}
		return filePath;
	}

	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArry of arguments for the plugin.
	 * @param callbackContext
	 *            The callback id used when calling back into JavaScript.
	 * @return True if the action was valid, false if not.
	 */
	public boolean execute(String action, JSONArray args,CallbackContext callbackContext) throws JSONException {
		if (action.equals("shareItem")) {			
			JSONObject jo = args.getJSONObject(0);
			String url = jo.getString("url");
			String R2oSessionId = jo.getString("R2oSessionId");
			String Cookie = jo.getString("Cookie");
			String fileName = jo.getString("filename");
			this.action = jo.getString("action");
			extension = jo.getString("extension");
			this.cordova.getActivity().registerReceiver(receiver,new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
			dm = (DownloadManager) webView.getContext().getSystemService(webView.getContext().DOWNLOAD_SERVICE);
			Request request = new Request(Uri.parse(url));
			request.addRequestHeader("Cookie", Cookie);
			request.addRequestHeader("R2oSessionId", R2oSessionId);
			MimeTypeMap mime = MimeTypeMap.getSingleton();				        
			String mimeType = mime.getMimeTypeFromExtension(R2OShare.extension);
			request.setMimeType(mimeType);
			request.allowScanningByMediaScanner();
			request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
			enqueue = dm.enqueue(request);
			this.callbackContext = callbackContext;
		} else {
			return false;
		}
		return true;
	}
}
