#!/usr/bin/env ruby

require 'digest'
require 'fileutils'

all_images = Dir.glob(ARGV[0])
output_dir = File.realpath(ARGV[1])

all_images.each { |image|
  next unless File.file?(image)

  sha256 = Digest::SHA256.file(image)
  size_of_chunk = sha256.hexdigest.length / 8

  each_chunk = sha256.hexdigest.chars.each_slice(size_of_chunk).collect { |a| a.join }

  dir_part = File.join(output_dir, "index.attic", *each_chunk)
  filename = File.join(dir_part, "00000000.jpg") #TODO: handle duplicate inputs via/ counter

  unless File.exists?(filename)
    FileUtils.mkdir_p(dir_part)
    FileUtils.ln_sf(image, filename)
    puts [image, "=>", filename].inspect
  end
}
