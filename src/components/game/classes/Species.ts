class Species {
    constructor(name: string, type: string, x: number, y: number, data: any) {
      this.name = name;
      this.type = type;
      this.x = x;
      this.y = y;
      this.color = data.color;
      this.size = data.size || 3;
      this.speed = data.speed || 1;
      this.prey = data.prey || [];
      this.energy = 100;
      this.lifespan = data.lifespan || 15;
      this.born = Date.now();
      this.dx = (Math.random() - 0.5) * this.speed;
      this.dy = (Math.random() - 0.5) * this.speed;
      this.generationCost = data.generationCost || 50;
    }
  
    move(width, height) {
      // Mise à jour de la position
      this.x += this.dx;
      this.y += this.dy;
  
      // Rebond sur les bords
      if (this.x - this.size < 0 || this.x + this.size > width) {
        this.dx *= -1;
      }
      if (this.y - this.size < 0 || this.y + this.size > height) {
        this.dy *= -1;
      }
  
      // Limites de la zone
      this.x = Math.max(this.size, Math.min(width - this.size, this.x));
      this.y = Math.max(this.size, Math.min(height - this.size, this.y));
  
      this.energy -= 0.1;
      return (Date.now() - this.born) / 1000 < this.lifespan && this.energy > 0;
    }
  
    checkCollision(other) {
      if (this.prey.includes(other.type)) {
        const dx = Math.abs(this.x - other.x);
        const dy = Math.abs(this.y - other.y);
        if (dx < (this.size + other.size) / 2 && dy < (this.size + other.size) / 2) {
          this.energy = Math.min(100, this.energy + 30);
          return true;
        }
      }
      return false;
    }
  }

  export default Species;
