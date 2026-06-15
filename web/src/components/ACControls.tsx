"use client";

import React, { useState, useEffect } from "react";
import { Power, Moon, Clock, Snowflake, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ACControls() {
  const [isOn, setIsOn] = useState(false);
  const [ledOn, setLedOn] = useState(true);
  const [autoOff, setAutoOff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial status
  useEffect(() => {
    fetch("/api/device/action")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setIsOn(data.device_on);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const sendAction = async (action: string, params: Record<string, any> = {}) => {
    try {
      await fetch("/api/device/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, params }),
      });
    } catch (e) {
      console.error(`Action ${action} failed:`, e);
    }
  };

  const togglePower = () => {
    const newState = !isOn;
    setIsOn(newState);
    sendAction(newState ? "turn_on" : "turn_off");
  };

  const toggleLed = () => {
    const newState = !ledOn;
    setLedOn(newState);
    sendAction("set_led", { state: newState });
  };

  const setTimer = (hours: number | null) => {
    setAutoOff(hours);
    if (hours === null) {
      sendAction("set_auto_off", { enabled: false, minutes: 0 });
    } else {
      sendAction("set_auto_off", { enabled: true, minutes: hours * 60 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl border border-slate-800 text-white mt-8 mb-8 transition-all duration-500 hover:shadow-cyan-900/20">
      {/* Decorative background glow */}
      <div className={cn(
        "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-700",
        isOn ? "bg-cyan-500" : "bg-slate-700"
      )} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Main AC Title & Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Snowflake className={cn("w-6 h-6 transition-all duration-500", isOn ? "text-cyan-400 animate-[spin_4s_linear_infinite]" : "text-slate-500")} />
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">AC Climate Control</h2>
          </div>
          <p className="text-sm text-slate-400">
            Smart Plug Tapo P110 <span className="opacity-50 mx-1">•</span> {loading ? "Connecting..." : (isOn ? "Cooling" : "Standby")}
          </p>
        </div>

        {/* Primary Power Button */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <button
            onClick={togglePower}
            disabled={loading}
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 shadow-xl",
              isOn 
                ? "bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/40 hover:shadow-cyan-400/60 scale-105" 
                : "bg-slate-800 border-2 border-slate-700 shadow-black/50 hover:bg-slate-700 hover:border-slate-600"
            )}
          >
            <Power className={cn(
              "h-10 w-10 transition-colors duration-300", 
              isOn ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-slate-400"
            )} />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex flex-col gap-4 w-full md:w-auto flex-1 md:max-w-xs">
          
          {/* Night Mode (LED) */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">Night Mode</span>
                <span className="text-xs text-slate-400">Plug LED Indicator</span>
              </div>
            </div>
            <button
              onClick={toggleLed}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                !ledOn ? "bg-cyan-500" : "bg-slate-600"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                !ledOn ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          {/* Sleep Timer */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-800/50 p-3 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">Sleep Timer</span>
            </div>
            <div className="flex justify-between gap-2">
              {[null, 1, 2, 4].map((h) => (
                <button
                  key={h === null ? "off" : h}
                  onClick={() => setTimer(h)}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all",
                    autoOff === h
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      : "bg-slate-900/50 text-slate-400 border border-transparent hover:bg-slate-700"
                  )}
                >
                  {h === null ? "Off" : `${h}h`}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
