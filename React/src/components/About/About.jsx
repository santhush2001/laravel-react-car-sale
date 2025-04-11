import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Clock, Sparkles } from "lucide-react";
import { a } from "@react-spring/three";

const useContinuousRotation = (axis = "y", speed = 0.01) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation[axis] += speed;
    }
  });
  return ref;
};

const BikeModel = () => {
  const { scene } = useGLTF("/models/bike.glb");

  const bikeRef = useContinuousRotation("y", 0.01);
  const frontWheelRef = useContinuousRotation("x", 0.05);
  const rearWheelRef = useContinuousRotation("x", 0.05);

  useEffect(() => {
    const frontWheel = scene.getObjectByName("frontWheel");
    const rearWheel = scene.getObjectByName("rearWheel");

    if (frontWheel) frontWheelRef.current = frontWheel;
    if (rearWheel) rearWheelRef.current = rearWheel;
  }, [scene, frontWheelRef, rearWheelRef]);

  return (
    <a.primitive
      object={scene}
      scale={[3, 3, 3]}
      ref={bikeRef}
    />
  );
};

const About = () => {
  return (
    <div id="about" className="dark:bg-black dark:text-white py-20 min-h-screen relative overflow-hidden bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right" data-aos-duration="1500" className="relative">
            <div className="relative w-full h-[600px]">
              <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 5, 5]} />
                <OrbitControls enableZoom={false} />
                <BikeModel />
              </Canvas>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4" data-aos="fade-up">
              <div className="flex items-center space-x-2">
                <div className="h-px w-8 bg-blue-600 dark:bg-blue-400"></div>
                <span className="text-5xl lg:text-7xl font-semibold font-serif mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">About Driveline</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
                Experience Luxury in
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Every Drive</span>
              </h1>
            </div>

            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-justify"
            >
              "At DriveLine, we redefine the experience of buying and selling premium second-hand vehicles.
              Our meticulously curated platform connects discerning buyers with verified sellers, offering
              a diverse selection of high-quality vehicles. With a commitment to excellence, we ensure every
              transaction is seamless, secure, and exceptional, giving you confidence and peace of mind at
              every step."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">24/7 Support</h3>
                <p className="text-gray-600 dark:text-gray-400">Round-the-clock assistance for all your vehicle needs</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Premium Quality</h3>
                <p className="text-gray-600 dark:text-gray-400">Thoroughly inspected and certified vehicles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
