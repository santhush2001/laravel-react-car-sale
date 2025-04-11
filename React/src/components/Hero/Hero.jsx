import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import AOS from "aos";
import * as THREE from "three";

const Hero = ({ theme }) => {
  const [translateX, setTranslateX] = useState(-230);
  const [colorIndex, setColorIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  const rainbowColors = [
    "linear-gradient(to right, #ff0000, #ff7300)",
    "linear-gradient(to right, #ff7300, #fffb00)",
    "linear-gradient(to right, #fffb00, #00ff00)",
    "linear-gradient(to right, #00ff00, #0000ff)",
    "linear-gradient(to right, #0000ff, #8a2be2)",
    "linear-gradient(to right, #8a2be2, #ff1493)",
    "linear-gradient(to right, #ff1493, #ff0000)",
  ];

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % rainbowColors.length);
    }, 500);

    const movementInterval = setInterval(() => {
      setTranslateX((prev) => {
        if (!reverse) {
          if (prev < -50) {
            return prev + 2;
          } else {
            setReverse(true);
            return prev - 2;
          }
        } else {
          if (prev > -230) {
            return prev - 2;
          } else {
            setReverse(false);
            return prev + 2;
          }
        }
      });
    }, 10);

    return () => {
      clearInterval(colorInterval);
      clearInterval(movementInterval);
    };
  }, [reverse]);

  const lineStyle = {
    height: "4px",
    width: "100px",
    background: rainbowColors[colorIndex],
    transform: `translateX(${translateX}%)`,
    borderRadius: "9999px",
    margin: "auto",
    transition: "transform 0.08s linear",
  };

  useEffect(() => {
    AOS.refresh();
  }, []);

  const modelPath = theme === "dark" ? "/models/sedan.glb" : "/models/car.glb";

  return (
    <div className="dark:bg-black dark:text-white duration-300 relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent -z-10" />

      <div className="container flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        <div className="text-center md:text-left space-y-8 flex-1" data-aos="fade-right">
          <h1 className="text-5xl lg:text-7xl font-semibold font-serif mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            DriveLine
          </h1>
          <div style={lineStyle} className="rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-justify">
            Find the best vehicles with Driveline. Buy or sell effortlessly on our secure platform!
          </p>
        </div>

        <div className="relative flex-1" data-aos="fade-left">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

          <Canvas
            key={theme} // Use theme as a key to force re-rendering
            camera={{ position: [0, 2, 5], fov: 50 }}
            className="w-full max-w-2xl mx-auto"
            style={{ height: "600px" }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <OrbitControls />
            <Model key={modelPath} modelPath={modelPath} theme={theme} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

const Model = ({ theme, modelPath }) => {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    const rotateModel = () => {
      scene.rotation.y += 0.01;
    };

    const interval = setInterval(rotateModel, 16);

    return () => clearInterval(interval);
  }, [scene]);

  useEffect(() => {
    if (modelPath === "/models/car.glb") {
      scene.scale.set(0.8, 0.8, 0.8); // Slightly decrease size for car.glb
    } else {
      scene.scale.set(1, 1, 1); // Keep default size for other models
    }
    scene.position.set(0, -1, 0); // Adjust position to ensure consistent placement

    const headlights = scene.getObjectByName("headlights");

    if (headlights) {
      const lightColor = theme === "dark" ? new THREE.Color(1, 1, 1) : new THREE.Color(0.8, 0.8, 0.8);
      headlights.material.emissive = lightColor;
      headlights.material.emissiveIntensity = 10;
    }
  }, [theme, scene, modelPath]);

  return <primitive object={scene} />;
};

export default Hero;
