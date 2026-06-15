import asyncio
from kasa import Credentials, Device, DeviceConfig, DeviceConnectionParameters, DeviceFamily, DeviceEncryptionType, Module

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
    
    energy = dev.modules.get(Module.Energy)
    if energy:
        import inspect
        if hasattr(energy, 'get_daily_stats'):
            print("get_daily_stats signature:", inspect.signature(energy.get_daily_stats))
        if hasattr(energy, 'get_monthly_stats'):
            print("get_monthly_stats signature:", inspect.signature(energy.get_monthly_stats))
            
if __name__ == "__main__":
    asyncio.run(main())
