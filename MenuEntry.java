package ch.skypro.tbx.idm.toolbox;

public class MenuEntry {
	private String sUrl;
	private String sImage;
	private String sTitle;
	private String sShortDesc;
	private String sLongDesc;
	private String sModuleID;
	private String sKeyCrypt = "";
	private long lValidTill = 0;
	private boolean bIsValid = true;
	
	public String getsKeyCrypt() {return sKeyCrypt;}
	public void setsKeyCrypt(String sKeyCrypt) {this.sKeyCrypt = sKeyCrypt;}
	public long getlValidTill() {return lValidTill;}
	public void setlValidTill(long lValidTill) {this.lValidTill = lValidTill;}
	public String getModuleID() {return sModuleID;}
	public String getTitle() {return sTitle;}
	public String getUrl() {return sUrl;}
	public String getImage() {return sImage != null ? sImage : "";}
	public String getShortDescr() {return sShortDesc != null ? sShortDesc : "";}
	public void setShortDesc(String desc){this.sShortDesc = desc;}
	public String getLongDesc(){return sLongDesc != null ? sLongDesc : "";}
	public void setLongDesc(String desc){this.sLongDesc = desc;}
	public void setUrl(String sUrl) {this.sUrl = sUrl;}
	public void setImage(String sImage) {this.sImage = sImage; System.out.println(this.sImage);}
	public void setTitle(String sTitle) {this.sTitle = sTitle;}
	public void setModuleID(String sModuleID) {this.sModuleID = sModuleID;}
	public boolean isValid() {return bIsValid;}
	public void setValid(boolean bValid) {this.bIsValid = bValid;}
	public MenuEntry() {}
	public MenuEntry(String sTitle,String sUrl,String sModuleID,String sKeyCrypt, long lValidTill, boolean bIsValid) {
		this.sTitle = sTitle;
		this.sUrl = sUrl;
		this.sModuleID = sModuleID;
		this.sKeyCrypt = sKeyCrypt;
		this.lValidTill = lValidTill;
		this.bIsValid = bIsValid;
	}
	public MenuEntry(String sTitle,String sUrl,String sImage,String sShortDesc, String sLongDesc,String sModuleID,String sKeyCrypt, long lValidTill, boolean bIsValid) {
		this.sTitle = sTitle;
		this.sUrl = sUrl;
		this.sImage = sImage;
		this.sShortDesc = sShortDesc;
		this.sLongDesc = sLongDesc;
		this.sModuleID = sModuleID;
		this.sKeyCrypt = sKeyCrypt;
		this.lValidTill = lValidTill;
		this.bIsValid = bIsValid;
	}
}
