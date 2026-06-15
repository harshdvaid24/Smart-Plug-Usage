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
    
    # Try setting LED
    try:
        led = dev.features.get("LED")
        print("LED feature value before:", led.value)
        await led.set_value(not led.value)
        await dev.update()
        led = dev.features.get("LED")
        print("LED feature value after:", led.value)
    except Exception as e:
        print("Failed to toggle LED feature:", e)
        
if __name__ == "__main__":
    asyncio.run(main())
