import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { RepoFile } from "../types";

export default function KnowledgeGraph({ files }: { files: RepoFile[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !files.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Build a hierarchy from file paths
    const data: any = { name: "root", children: [] };
    
    files.forEach(f => {
      const parts = f.path.split("/");
      let current = data;
      parts.forEach((part, i) => {
        let child = current.children.find((c: any) => c.name === part);
        if (!child) {
          child = { name: part, children: [] };
          current.children.push(child);
        }
        current = child;
      });
    });

    // Flatten for force simulation
    const nodes: any[] = [];
    const links: any[] = [];

    function flatten(node: any, parent: any = null) {
      const newNode = { id: node.name + (parent ? parent.id : ""), name: node.name, isFolder: node.children.length > 0 };
      nodes.push(newNode);
      if (parent) {
        links.push({ source: parent.id, target: newNode.id });
      }
      node.children.forEach((c: any) => flatten(c, newNode));
    }
    flatten(data);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(40))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", (d: any) => d.isFolder ? 8 : 4)
      .attr("fill", (d: any) => d.isFolder ? "#3B82F6" : "#94a3b8")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d: any) => d.name)
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .attr("font-weight", (d: any) => d.isFolder ? "bold" : "normal");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [files]);

  return (
    <div className="flex-1 flex flex-col p-8 h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-2">Knowledge Graph</h2>
        <p className="text-primary/60">Visualizing file relationships and module clusters.</p>
      </div>
      <div className="flex-1 glass-card overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full cursor-move" />
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-black/5">
          Interactive Visualization
        </div>
      </div>
    </div>
  );
}
