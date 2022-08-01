using FileUpload.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace FileUpload.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FileManager : ControllerBase
    {
        private FileUploadContext _fileUploadContext;
        public FileManager(FileUploadContext FileUploadContext)
        {
            _fileUploadContext = FileUploadContext;
        }
        [HttpPost]
        public IActionResult UploadFile()
        {
            try
            {
                var files = Request.Form.Files;
                var folderName = Path.Combine("StaticFiles", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                bool exists = System.IO.Directory.Exists(pathToSave);

                if (!exists)
                    System.IO.Directory.CreateDirectory(pathToSave);
                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
            return Ok();
        }

        [HttpPost]
        public IActionResult SaveData(List<ItemImage> ItemImageList)
        {
            try
            {
                if (ItemImageList != null && ItemImageList.Count() > 0)
                {
                    foreach (var itemImage in ItemImageList)
                    {
                        _fileUploadContext.ItemImages.Add(itemImage);
                        _fileUploadContext.SaveChanges();

                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
            return Ok();
        }

        [HttpGet]
        public IEnumerable<ItemImage> Get()
        {
            return _fileUploadContext.ItemImages.ToList();
        }
    }
   
}
