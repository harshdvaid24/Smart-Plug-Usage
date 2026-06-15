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
    
    print("\n--- AutoOff Module ---")
    auto_off = dev.modules.get(Module.AutoOff)
    if auto_off:
        print(f"Is Enabled: {getattr(auto_off, 'is_enabled', 'N/A')}")
        print(f"Delay: {getattr(auto_off, 'delay', 'N/A')}")

    print("\n--- Led Module ---")
    led = dev.modules.get(Module.Led)
    if led:
        print(f"Has turn_on/turn_off: {hasattr(led, 'turn_on')}, {hasattr(led, 'turn_off')}")
        print(f"Is Led On: {getattr(led, 'is_on', 'N/A')}")
        print(f"State: {getattr(led, 'state', 'N/A')}")
        
    print("\n--- OverheatProtection Module ---")
    overheat = dev.modules.get(Module.OverheatProtection)
    if overheat:
        print(f"Is Overheated: {getattr(overheat, 'is_overheated', 'N/A')}")
        
    print("\n--- Energy History ---")
    energy = dev.modules.get(Module.Energy)
    if energy:
        if hasattr(energy, 'get_daily_stats'):
            try:
                stats = await energy.get_daily_stats(2026, 6) # Current month is June 2026 based on local time
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
