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
        print()

    print("--- Checking set capability ---")
    print("Has dev.turn_on?", hasattr(dev, "turn_on"))
    print("Has dev.turn_off?", hasattr(dev, "turn_off"))
    print("Has dev.set_alias?", hasattr(dev, "set_alias"))

if __name__ == "__main__":
    asyncio.run(main())
