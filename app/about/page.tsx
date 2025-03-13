import Image from "next/image";
import logo from "../../public/logo.jpeg";
export default function About() {
  return (
    <div className="max-w-7xl mx-auto p-12 mt-12 mb-12">
      <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4 ">About Genesis</h1>
        <Image
          src={logo}
          alt="Genesis Logo"
          className="rounded mb-8 mt-8"
        />
        <p className="text-xl mb-8">
          Genesis is an AI-powered image generator that allows users to create stunning images with ease. Our platform uses cutting-edge technology to generate high-quality images that can be used for a variety of purposes.
          </p>
      </div>
      <div className="grid mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At Genesis, we believe that creativity should be accessible to everyone. That&apos;s why we&apos;ve created a platform that makes it easy for users to generate images without needing any prior experience or technical knowledge.
          </p>
        </div>
        <div className="border rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg mb-4">
            Our team is dedicated to providing the best possible experience for our users. We&apos;re constantly working to improve our platform and add new features to make it even easier for users to create amazing images.
          </p>
        </div>
        <div className="border rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Get Started</h2>
          <p className="text-lg mb-4">
            Whether you&apos;re a professional artist or just starting out, Genesis is the perfect platform for anyone looking to create stunning images. Our platform is free to use, and we offer a range of features and tools to help you get started.
          </p>
        </div>
      </div>
    </div>
  );
}