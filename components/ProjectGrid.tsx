import Image from "next/image";

const projects = [
  "/project-1.jpg",
  "/project-2.jpg",
  "/project-3.jpg",
  "/project-4.jpg",
  "/project-5.jpg",
  "/project-6.jpg"
];

export default function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects.map((src, index) => (
        <div key={src} className="project-card">
          <Image
            src={src}
            alt={`Project ${index + 1}`}
            width={600}
            height={600}
            className="project-image"
          />
        </div>
      ))}
    </div>
  );
}
