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
    
    print("\n--- Energy History ---")
    energy = dev.modules.get(Module.Energy)
    if energy:
        if hasattr(energy, 'get_daily_stats'):
            try:
                stats = await energy.get_daily_stats(2026, 6) # Current month is June 2026
                print(f"Daily Stats (2026-06): {stats}")
            except Exception as e:
                print(f"Error getting daily stats: {e}")
        
        if hasattr(energy, 'get_monthly_stats'):
            try:
                stats = await energy.get_monthly_stats(2026)
                print(f"Monthly Stats (2026): {stats}")
            except Exception as e:
                print(f"Error getting monthly stats: {e}")

if __name__ == "__main__":
    asyncio.run(main())
