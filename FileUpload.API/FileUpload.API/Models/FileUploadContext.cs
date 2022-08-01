using Microsoft.EntityFrameworkCore;

namespace FileUpload.API.Models
{
    public class FileUploadContext : DbContext
    {
        public FileUploadContext()
        {

        }
        public FileUploadContext(DbContextOptions<FileUploadContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=LAPTOP-7EVFMOP0;Initial Catalog=FileUploadDB;Integrated Security=True");
            }
        }
        public DbSet<ItemImage> ItemImages { get; set; }
    }
}
