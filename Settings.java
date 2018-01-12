package ch.skypro.tbx.idm.toolbox;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import java.util.Map;
import java.util.Properties;
import org.yaml.snakeyaml.Yaml;

public class Settings {
	private Properties config;
	
	
	public Properties getSettings(String filename){
		InputStream input;
		config = new Properties();
		
		try{
			File file = new File(filename);
			input = new FileInputStream(file);
			Yaml yaml = new Yaml();
			Map<String, Object> object = (Map<String, Object>) yaml.load(input);
			Map<String, Object> resourceSetting = (Map<String, Object>) object.get("resources");
			for (Map.Entry<String, Object> entry: resourceSetting.entrySet()){
					config.setProperty(entry.getKey(), entry.getValue().toString());
			}
			file.delete();
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		return config;
	}	
}
