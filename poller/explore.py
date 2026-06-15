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
    
    print("--- Device Info ---")
    print(f"Alias: {dev.alias}")
    print(f"Model: {dev.model}")
    print(f"HW Info: {dev.hw_info}")
    print(f"Is On: {dev.is_on}")
    
    print("\n--- Modules ---")
    for mod_name, mod in dev.modules.items():
        print(f"{mod_name}:")
        if hasattr(mod, 'features'):
            for feat in mod.features.values():
                print(f"  - Feature: {feat.name} = {feat.value}")
        else:
            print(f"  - No features listed directly. Type: {type(mod)}")

    print("\n--- Energy Module Details ---")
    from kasa import Module
    energy = dev.modules.get(Module.Energy)
    if energy:
        print(f"Today: {energy.consumption_today}")
        print(f"Month: {energy.consumption_this_month}")
        print(f"Current: {energy.current_consumption}")
        if hasattr(energy, 'get_monthly_stats'):
            print("Has get_monthly_stats!")
            
if __name__ == "__main__":
    asyncio.run(main())
