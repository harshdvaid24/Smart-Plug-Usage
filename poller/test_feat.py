import asyncio
from kasa import Credentials, Device, DeviceConfig, DeviceConnectionParameters, DeviceFamily, DeviceEncryptionType

async def main():
    host = "192.168.29.195"
    email = "vaidharsh24@gmail.com"
    password = "EnterNewPassword@27"
    
    dev = await Device.connect(
        config=DeviceConfig(
            host=host,
            credentials=Credentials(email, password),
            uses_http=True,
            connection_type=DeviceConnectionParameters(
                device_family=DeviceFamily.SmartTapoPlug,
                encryption_type=DeviceEncryptionType.Klap,
            )
        )
    )
    await dev.update()
    
    for feat_id, feat in dev.features.items():
        print(f"ID: '{feat_id}', Name: '{feat.name}'")
        
    print("\nSetting auto off delay to 3600")
    try:
        # Assuming ID for auto off delay is 'auto_off_in' or something
        pass
    except Exception as e:
        print(e)
        
if __name__ == "__main__":
    asyncio.run(main())
