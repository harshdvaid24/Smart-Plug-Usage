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
        stats_daily = await energy.get_daily_stats(year=2024, month=6)
        print("Daily 2024-06:", stats_daily)

        stats_monthly = await energy.get_monthly_stats(year=2024)
        print("Monthly 2024:", stats_monthly)
        
        # Test 2026 if it has data
        stats_daily_26 = await energy.get_daily_stats(year=2026, month=6)
        print("Daily 2026-06:", stats_daily_26)

if __name__ == "__main__":
    asyncio.run(main())
