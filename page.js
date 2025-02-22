"use client";

import { useEffect, useState } from "react";
import { Copy, Crown, Globe, Users, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MinecraftServer() {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP; // Replace with your server IP

  const fetchServerStatus = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
      const data = await response.json();
      setServerStatus({
        online: data.online,
        players: {
          online: data.players?.online || 0,
          max: data.players?.max || 0,
          list: data.players?.list || [],
        },
        version: data.version || "Unknown",
        description:
          data.motd?.clean?.[0] || "Welcome to our Minecraft server!",
      });
    } catch (error) {
      console.error("Failed to fetch server status:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    toast({
      title: "Server IP copied!",
      description: "The IP has been copied to your clipboard.",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Minecraft background */}
      <Image
        src={process.env.NEXT_PUBLIC_BACKGROUND}
        alt="Minecraft Background"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Minecraft dirt texture overlay */}
      <div
        className="absolute inset-0 bg-[url('/minecraft-dirt.png')] opacity-20 bg-repeat"
        style={{ backgroundSize: "64px 64px" }}
      />

      {/* Dark gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-white minecraft-title glow-white">
            {process.env.NEXT_PUBLIC_NAME}
          </h1>
          <p className="text-gray-300 minecraft-text">
            Join the adventure today!
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
          <motion.div variants={item}>
            <Card className="border-zinc-800/50 bg-black/40 backdrop-blur-md transition-all hover:bg-black/50 minecraft-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#E0E0E0] minecraft-text">
                    <Globe className="h-5 w-5" />
                    Server Status
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={fetchServerStatus}
                          className={`transition-transform minecraft-button ${
                            isRefreshing ? "animate-spin" : "hover:rotate-180"
                          }`}
                        >
                          <RefreshCcw className="h-4 w-4 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh server status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription className="text-[#8B8B8B] minecraft-text">
                  Real-time server information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px] bg-[#2C2C2C]" />
                      <Skeleton className="h-4 w-[200px] bg-[#2C2C2C]" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              serverStatus?.online
                                ? "bg-pink-500"
                                : "bg-red-500"
                            } ${serverStatus?.online ? "animate-pulse" : ""}`}
                          />
                          <span className="font-medium text-[#E0E0E0] minecraft-text">
                            {serverStatus?.online ? "Online" : "Offline"}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-[#2C2C2C] text-[#E0E0E0] minecraft-badge"
                        >
                          {serverStatus?.version}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={copyIP}
                          variant="outline"
                          className="w-full border-[#2C2C2C] bg-[#1A1A1A]/50 text-[#E0E0E0] hover:bg-[#2C2C2C] hover:text-white minecraft-button"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {SERVER_IP}
                        </Button>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-lg bg-[#1A1A1A]/50 p-4 minecraft-panel"
                      >
                        <p className="text-sm text-[#E0E0E0] minecraft-text">
                          {serverStatus?.description}
                        </p>
                      </motion.div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-zinc-800/50 bg-black/40 backdrop-blur-md transition-all hover:bg-black/50 minecraft-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E0E0E0] minecraft-text">
                  <Users className="h-5 w-5" />
                  Online Players
                </CardTitle>
                <CardDescription className="text-[#8B8B8B] minecraft-text">
                  {loading ? (
                    <Skeleton className="h-4 w-[100px] bg-[#2C2C2C]" />
                  ) : (
                    `${serverStatus?.players.online || 0} / ${
                      serverStatus?.players.max || 0
                    } players`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-[64px] w-full rounded-lg bg-[#2C2C2C]"
                      />
                    ))}
                  </div>
                ) : serverStatus?.players.list &&
                  serverStatus.players.list.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {console.log("Player List:", serverStatus.players.list)}
                    {serverStatus.players.list.map((player, index) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        key={player.id || `${player.name}-${index}`}
                        className="group flex flex-col items-center rounded-lg bg-[#1A1A1A]/50 p-2 transition-all hover:bg-[#2C2C2C] hover:shadow-[0_0_10px_rgba(255,192,203,0.1)] minecraft-player-card"
                      >
                        <div className="relative">
                          <Image
                            src={`https://crafatar.com/avatars/8667ba71-b85a-4004-af54-457a9734eed7?overlay=true`}
                            alt={player}
                            width={32}
                            height={32}
                            className="rounded transition-transform group-hover:scale-110"
                          />
                        </div>
                        <span className="mt-1 text-sm font-medium text-white minecraft-text">
                          {player}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[#8B8B8B] minecraft-text">
                    No players online
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2">
            <Card className="border-zinc-800/50 bg-black/40 backdrop-blur-md transition-all hover:bg-black/50 minecraft-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E0E0E0] minecraft-text">
                  <Crown className="h-5 w-5" />
                  Server Features
                </CardTitle>
                <CardDescription className="text-[#8B8B8B] minecraft-text">
                  What makes our server special
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "Survival Experience",
                      description:
                        "Pure vanilla survival gameplay with essential commands",
                      icon: "⚔️",
                    },
                    {
                      title: "Active Community",
                      description:
                        "Friendly players and regular community events",
                      icon: "🏰",
                    },
                    {
                      title: "Anti-Grief Protection",
                      description:
                        "Advanced protection systems to keep your builds safe",
                      icon: "🛡️",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="group rounded-lg border border-[#2C2C2C] bg-[#1A1A1A]/30 p-4 transition-all hover:bg-[#1A1A1A]/50 hover:shadow-[0_0_15px_rgba(255,192,203,0.1)] minecraft-feature-card"
                    >
                      <div className="mb-2 text-2xl">{feature.icon}</div>
                      <h3 className="mb-2 font-semibold text-[#E0E0E0] group-hover:text-white minecraft-text">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[#8B8B8B] group-hover:text-[#E0E0E0] minecraft-text">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
