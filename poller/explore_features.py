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
    
    print("--- All Features ---")
    for feat_name, feat in dev.features.items():
        print(f"Feature: {feat.name}")
        print(f"  Type: {feat.type}")
        print(f"  Value: {feat.value}")
        print(f"  Is Mutable (can set): {feat.is_mutable}")
        print()

if __name__ == "__main__":
    asyncio.run(main())
