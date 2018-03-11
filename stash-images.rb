#!/usr/bin/env ruby

require 'digest'
require 'fileutils'

all_images = Dir.glob(ARGV[0])

all_images.each { |image|
  next unless File.file?(image)

  sha256 = Digest::SHA256.file(image)
  size_of_chunk = sha256.hexdigest.length / 8

  each_chunk = sha256.hexdigest.chars.each_slice(size_of_chunk).collect { |a| a.join }

  dir_part = File.join("build", "index.attic", *each_chunk)
  filename = File.join(dir_part, "00000000.jpg")

  unless File.exists?(filename)
    FileUtils.mkdir_p(dir_part)
    FileUtils.cp(image, filename)
    puts filename.inspect
  end
}
